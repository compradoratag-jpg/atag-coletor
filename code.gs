/**
 * ATAG Coletor & Follow-Up - Google Apps Script Backend (Web App)
 * Integração completa para persistência em nuvem (Google Sheets)
 */

function doGet(e) {
  const param = e.parameter;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Rota do Follow-up de Cargas
  if (param.tipo === 'followup' || param.action === 'getFollowUp') {
    const sheet = ss.getSheetByName('followup');
    if (!sheet) return jsonResponse([]);
    return jsonResponse(getRowsData(sheet));
  }
  
  // Rota das Transportadoras
  if (param.tipo === 'transportadoras' || param.action === 'getTransportadoras') {
    const sheet = ss.getSheetByName('transportadoras');
    if (!sheet) return jsonResponse([]);
    return jsonResponse(getRowsData(sheet));
  }
  
  // Rota Padrão: Dados do Coletor de Estoque
  const sheet = ss.getSheetByName('coletor');
  if (!sheet) return jsonResponse([]);
  return jsonResponse(getRowsData(sheet));
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = contents.action;
    const modulo = contents.modulo || 'coletor';

    // -------------------------------------------------------------
    // MÓDULO COLETOR DE ESTOQUE
    // -------------------------------------------------------------
    if (modulo === 'coletor') {
      const sheet = ss.getSheetByName('coletor') || ss.insertSheet('coletor');
      
      if (action === 'insert') {
        const id = 'ID_' + new Date().getTime();
        const dataAtual = Utilities.formatDate(new Date(), 'GMT-3', 'dd/MM/yyyy HH:mm:ss');
        sheet.appendRow([
          id,
          contents.codigo || '',
          contents.localizacao || '',
          contents.posicao || '',
          contents.locacao || '',
          contents.foto || '',
          contents.obs || '',
          dataAtual
        ]);
        return jsonResponse({ status: 'sucesso', message: 'Item registrado com sucesso', id: id });
      }

      if (action === 'update') {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(contents.id)) {
            sheet.getRange(i + 1, 2).setValue(contents.codigo || '');
            sheet.getRange(i + 1, 3).setValue(contents.localizacao || '');
            sheet.getRange(i + 1, 4).setValue(contents.posicao || '');
            sheet.getRange(i + 1, 5).setValue(contents.locacao || '');
            if (contents.foto) sheet.getRange(i + 1, 6).setValue(contents.foto);
            sheet.getRange(i + 1, 7).setValue(contents.obs || '');
            return jsonResponse({ status: 'sucesso', message: 'Item atualizado' });
          }
        }
      }

      if (action === 'delete') {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(contents.id)) {
            sheet.deleteRow(i + 1);
            return jsonResponse({ status: 'sucesso', message: 'Item excluído' });
          }
        }
      }
    }

    // -------------------------------------------------------------
    // MÓDULO FOLLOW-UP DE CARGAS & TRANSPORTADORA
    // -------------------------------------------------------------
    if (modulo === 'followup') {
      const sheet = ss.getSheetByName('followup') || ss.insertSheet('followup');

      if (action === 'insertFollowUp') {
        const id = contents.id || 'FU_' + new Date().getTime();
        sheet.appendRow([
          id,
          contents.nota || contents.nf || '',
          contents.origem || contents.emitente || '',
          contents.cnpj || '',
          contents.transportadora || '',
          contents.site || '',
          contents.telefone || '',
          contents.whatsapp || '',
          contents.previsao || '',
          contents.status || 'EM TRÂNSITO',
          contents.obs || ''
        ]);
        return jsonResponse({ status: 'sucesso', message: 'Carga registrada', id: id });
      }

      if (action === 'updateFollowUp') {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(contents.id || contents.ID_Registro)) {
            if (contents.transportadora !== undefined) sheet.getRange(i + 1, 5).setValue(contents.transportadora);
            if (contents.site !== undefined) sheet.getRange(i + 1, 6).setValue(contents.site);
            if (contents.telefone !== undefined) sheet.getRange(i + 1, 7).setValue(contents.telefone);
            if (contents.whatsapp !== undefined) sheet.getRange(i + 1, 8).setValue(contents.whatsapp);
            if (contents.previsao !== undefined) sheet.getRange(i + 1, 9).setValue(contents.previsao);
            if (contents.status !== undefined) sheet.getRange(i + 1, 10).setValue(contents.status);
            if (contents.obs !== undefined) sheet.getRange(i + 1, 11).setValue(contents.obs);
            return jsonResponse({ status: 'sucesso', message: 'Carga atualizada' });
          }
        }
      }

      if (action === 'deleteFollowUp') {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(contents.id || contents.ID_Registro)) {
            sheet.deleteRow(i + 1);
            return jsonResponse({ status: 'sucesso', message: 'Carga excluída' });
          }
        }
      }

      if (action === 'importLote') {
        const itens = contents.itens || [];
        let inseridas = 0;
        itens.forEach(item => {
          const id = 'FU_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
          sheet.appendRow([
            id,
            item.nf || '',
            item.origem || '',
            contents.cnpj || '',
            '', '', '', '', '',
            'EM TRÂNSITO',
            ''
          ]);
          inseridas++;
        });
        return jsonResponse({ status: 'sucesso', inseridas: inseridas });
      }
    }

    if (modulo === 'transportadoras' && action === 'insertTransportadora') {
      const sheet = ss.getSheetByName('transportadoras') || ss.insertSheet('transportadoras');
      const data = sheet.getDataRange().getValues();
      let encontrada = false;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).toLowerCase() === String(contents.nome).toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(contents.link || '');
          sheet.getRange(i + 1, 3).setValue(contents.telefone || '');
          sheet.getRange(i + 1, 4).setValue(contents.whatsapp || '');
          encontrada = true;
          break;
        }
      }

      if (!encontrada) {
        sheet.appendRow([
          contents.nome || '',
          contents.link || '',
          contents.telefone || '',
          contents.whatsapp || ''
        ]);
      }
      return jsonResponse({ status: 'sucesso', message: 'Transportadora atualizada/cadastrada' });
    }

    return jsonResponse({ status: 'erro', message: 'Ação não reconhecida' });

  } catch (err) {
    return jsonResponse({ status: 'erro', message: err.toString() });
  }
}

// -------------------------------------------------------------
// FUNÇÕES AUXILIARES DE FORMATAÇÃO E RETORNO JSON
// -------------------------------------------------------------
function getRowsData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

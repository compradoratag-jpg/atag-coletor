# 🏭 Industrial Warehouse & Logistics Suite (PWA)

Um sistema web progressivo (**PWA**) mobile-first de alta performance desenvolvido para **gestão de estoque, endereçamento industrial e follow-up de cargas e transportes**, projetado para rodar diretamente no navegador com suporte a leitura de códigos de barras por câmara, funcionamento offline (Service Worker) e persistência de dados em nuvem via Google Sheets (Apps Script).

---

## 🚀 Principais Módulos da Solução

### 1. Coletor Industrial de Estoque (`coletor.html`)
- **Leitura de Códigos de Barras:** Suporte nativo a pistolas de bipagem via input rápido (com atalhos de teclado como `F2` e `Enter`) e leitor integrado por câmara utilizando `html5-qrcode` com suporte a lanterna (torch).
- **Endereçamento Inteligente:** Validação em tempo real de ruas e posições (ex: `R01-015`), alertando automaticamente se uma locação já estiver ocupada por outro SKU.
- **Consulta em Tempo Real:** Listagem dinâmica agrupada por ruas com acordeões fluidos, modo compacto/confortável e exportação direta para planilha (CSV).
- **Anexos Visuais:** Captura de fotos dos produtos armazenadas diretamente em cache/memória para auditoria rápida.

### 2. Gestão de Cargas e Follow-up (`followup.html`)
- **Controle de Notas Fiscais:** Monitoramento de status de entregas (*Em Trânsito*, *Pendente / Atrasada*, *Entregue*).
- **Importação em Lote:** Sincronização rápida de lotes de notas fiscais coladas diretamente de planilhas ou sistemas ERP, com baixa automática de entregas e geração de relatórios formatados para impressão (A4).
- **Integração com WhatsApp:** Geração automática de mensagens padronizadas de cobrança de rastreio para transportadoras divididas por filiais/CNPJ.
- **Painel Multi-Filial:** Gestão segregada para matriz e filiais com indicadores estatísticos em tempo real.
- ---

## 📱 Tecnologias Utilizadas

- **Frontend:** HTML5, Tailwind CSS (via CDN) e JavaScript Moderno (ES6+).
- **PWA (Progressive Web App):** `manifest.json` e `sw.js` para instalação rápida em dispositivos móveis (Android/iOS) como aplicativo nativo.
- **Backend & Banco de Dados (Zero-Cost):** Google Apps Script (Web App) integrado ao Google Sheets para armazenar e sincronizar os dados de forma gratuita, segura e sem custos de servidores dedicados.

---

## ⚙️ Como Instalar e Configurar na sua Empresa

### Passo 1: Clonar o Repositório
Clone este repositório para o seu ambiente local ou utilize diretamente via **GitHub Pages**:
- Comando para clone: `git clone [https://github.com/compradoratag-jpg/atag-coletor.git](https://github.com/compradoratag-jpg/atag-coletor.git)`
- ### Passo 2: Configurar a Planilha de Backend (Google Sheets)

Crie uma nova planilha no Google Sheets com três abas principais:

coletor (Colunas: id, codigo, localizacao, posicao, locacao, foto, obs, data)

followup (Colunas: id, nota, origem, cnpj, transportadora, site, telefone, whatsapp, previsao, status, obs)

transportadoras (Colunas: nome, link, telefone, whatsapp)

No menu superior da planilha, vá em Extensões > Apps Script.

Abra o arquivo code.gs disponível na raiz deste repositório, copie todo o seu código, cole no editor do Apps Script e salve.

Clique em Implantar > Nova Implantação, selecione o tipo Aplicativo da Web (Web App), defina o acesso para "Qualquer pessoa" e copie a URL gerada.

### Passo 3: Configurar a URL do Web App
Nos arquivos `coletor.html` e `followup.html`, localize a constante global no início do script JavaScript e substitua pela URL do seu Google Apps Script:
- `const WEB_APP_URL = "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI";`

### Passo 4: Publicar no GitHub Pages
1. Vá até as configurações do seu repositório no GitHub (**Settings > Pages**).
2. Em **Source**, selecione a branch `main` (ou `master`) e a pasta `/root`.
3. Salve e acesse o link gerado pelo GitHub para utilizar o sistema em qualquer celular ou computador da sua operação!

---

## 📄 Licença
Distribuído sob a licença MIT. Sinta-se à vontade para utilizar, modificar e adaptar para a realidade logística da sua empresa.

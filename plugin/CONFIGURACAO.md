# Guia de Configuração - Landing Page Plugin Stop and Go BR

## 🚀 Início Rápido

### Passo 1: Configurar Stripe

#### 1.1 Criar Conta Stripe (se ainda não tiver)
1. Acesse https://stripe.com
2. Crie uma conta
3. Complete o processo de verificação

#### 1.2 Obter Chaves da API
1. Acesse: https://dashboard.stripe.com/apikeys
2. Você verá duas chaves:
   - **Publishable key** (pk_test_... ou pk_live_...)
   - **Secret key** (sk_test_... ou sk_live_...)
3. Copie a **Publishable key** (você vai precisar dela)

⚠️ **IMPORTANTE**: 
- Use chaves de **TEST** (pk_test_...) para testar
- Use chaves de **LIVE** (pk_live_...) apenas em produção

#### 1.3 Criar Produtos e Preços
1. Acesse: https://dashboard.stripe.com/products
2. Clique em "Add product"
3. Crie três produtos:

**Produto 1: Plugin Básico**
- Name: Plugin Stop and Go BR - Básico
- Description: Plano básico com recursos essenciais
- Pricing: R$ 99.00 BRL / month (recurring)
- Copie o **Price ID** (price_...)

**Produto 2: Plugin Profissional**
- Name: Plugin Stop and Go BR - Profissional
- Description: Plano profissional com recursos avançados
- Pricing: R$ 199.00 BRL / month (recurring)
- Copie o **Price ID** (price_...)

**Produto 3: Plugin Enterprise**
- Name: Plugin Stop and Go BR - Enterprise
- Description: Plano enterprise com todos os recursos
- Pricing: R$ 399.00 BRL / month (recurring)
- Copie o **Price ID** (price_...)

#### 1.4 Atualizar script.js

Abra o arquivo `plugin/script.js` e faça as seguintes alterações:

```javascript
// Linha 3 - Substituir pela sua Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_SUA_CHAVE_AQUI';
// Para produção: const STRIPE_PUBLISHABLE_KEY = 'pk_live_SUA_CHAVE_AQUI';

// Linhas 7-11 - Substituir pelos seus Price IDs
const PRICING_PLANS = {
    basic: 'price_SEU_PRICE_ID_BASICO',
    professional: 'price_SEU_PRICE_ID_PROFISSIONAL',
    enterprise: 'price_SEU_PRICE_ID_ENTERPRISE'
};
```

**Exemplo real:**
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51AbCdEfGhIjKlMnOpQrStUv';

const PRICING_PLANS = {
    basic: 'price_1AbCdEfGhIjKlMnOpQrStUv',
    professional: 'price_2XyZaBcDeFgHiJkLmNoPqRs',
    enterprise: 'price_3TuVwXyZaBcDeFgHiJkLmNo'
};
```

### Passo 2: Adicionar Suas Imagens

#### 2.1 Preparar Imagens
Você mencionou que já tem diversas imagens prontas. Organize-as:

1. Escolha 3 screenshots principais do seu plugin:
   - Dashboard principal
   - Telemetria em tempo real
   - Gestão de campeonatos

2. Otimize as imagens:
   - Tamanho recomendado: 1200x675 pixels
   - Formato: JPG ou PNG
   - Tamanho do arquivo: < 200KB cada

#### 2.2 Adicionar Imagens à Pasta
1. Coloque suas imagens em `plugin/images/`
2. Nomeie-as:
   - `dashboard.jpg`
   - `telemetry.jpg`
   - `management.jpg`

#### 2.3 Atualizar HTML (opcional)
Se quiser usar imagens reais em vez dos placeholders SVG, edite `index.html`:

Encontre a seção gallery (linha ~165) e substitua:

```html
<!-- DE: -->
<div class="gallery-placeholder">
    <svg>...</svg>
    <p>Dashboard Principal</p>
</div>

<!-- PARA: -->
<img src="images/dashboard.jpg" alt="Dashboard Principal" loading="lazy">
```

### Passo 3: Testar Localmente

#### 3.1 Servidor Local
Você precisa de um servidor HTTP para testar localmente (não funciona com file://)

**Opção 1: Python**
```bash
cd plugin
python3 -m http.server 8000
```
Acesse: http://localhost:8000

**Opção 2: Node.js**
```bash
cd plugin
npx http-server -p 8000
```
Acesse: http://localhost:8000

**Opção 3: VS Code**
- Instale extensão "Live Server"
- Clique direito em index.html → "Open with Live Server"

#### 3.2 Testar Pagamento
1. Acesse a landing page local
2. Clique em "Começar Agora" em qualquer plano
3. Use cartão de teste do Stripe:
   - Número: `4242 4242 4242 4242`
   - Data: qualquer data futura
   - CVC: qualquer 3 dígitos
   - CEP: qualquer

4. Complete o checkout
5. Você deve ser redirecionado para `success.html`

### Passo 4: Configurar Domínio

#### 4.1 Requisitos
- Domínio: stopandgobr.com (que você já tem)
- Certificado SSL/HTTPS ativo (necessário para Stripe)

#### 4.2 Estrutura de Pastas no Servidor
```
stopandgobr.com/
├── index.html          # Seu site principal
├── loja/              # Sua loja existente
└── plugin/            # Nova landing page
    ├── index.html
    ├── success.html
    ├── styles.css
    ├── script.js
    └── images/
```

#### 4.3 Upload via FTP/SFTP
1. Conecte-se ao seu servidor
2. Navegue até o diretório raiz do site
3. Faça upload da pasta `plugin` completa
4. Verifique permissões (755 para pastas, 644 para arquivos)

#### 4.4 Testar
Acesse: https://stopandgobr.com/plugin

### Passo 5: Configurar Webhooks (Recomendado)

Os webhooks permitem que você seja notificado sobre eventos de pagamento.

#### 5.1 Criar Webhook no Stripe
1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique "Add endpoint"
3. Endpoint URL: `https://stopandgobr.com/api/webhook`
4. Selecione eventos:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`

#### 5.2 Implementar Endpoint (Backend necessário)
Você vai precisar criar um backend para processar webhooks.

Exemplo básico (Node.js):
```javascript
const stripe = require('stripe')('sk_live_...');

app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_...'; // Do dashboard Stripe
    
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        
        if (event.type === 'checkout.session.completed') {
            // Enviar email de boas-vindas
            // Criar acesso ao plugin
            // Adicionar à lista de clientes
        }
        
        res.json({received: true});
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
```

### Passo 6: Personalização (Opcional)

#### 6.1 Alterar Cores
Edite `styles.css` linha 9:
```css
:root {
    --primary-color: #e63946;      /* Sua cor principal */
    --secondary-color: #457b9d;    /* Cor secundária */
}
```

#### 6.2 Alterar Textos
Todos os textos estão em português em `index.html`. 
Personalize conforme sua necessidade.

#### 6.3 Ajustar Preços
Se seus preços forem diferentes, atualize em:
1. Stripe Dashboard (os produtos)
2. `index.html` (seção pricing, visual)
3. `script.js` (já está vinculado ao Stripe)

## 🔒 Segurança

### Checklist de Segurança
- [ ] Nunca exponha sua Secret Key (sk_...) no frontend
- [ ] Use HTTPS em produção (obrigatório para Stripe)
- [ ] Valide webhooks com assinatura
- [ ] Mantenha bibliotecas atualizadas
- [ ] Use chaves de TEST durante desenvolvimento

## 📞 Suporte

### Problemas Comuns

**Erro: "Stripe is not defined"**
- Verifique se a tag `<script src="https://js.stripe.com/v3/"></script>` está no HTML
- Abra Console do navegador para ver erros

**Checkout não abre**
- Verifique se as chaves do Stripe estão corretas
- Confirme que está usando HTTPS
- Veja Console do navegador para erros

**Imagens não aparecem**
- Verifique o caminho: `images/nome-do-arquivo.jpg`
- Confirme que as imagens foram enviadas ao servidor
- Verifique permissões dos arquivos (644)

### Recursos
- Documentação Stripe: https://stripe.com/docs
- Suporte Stripe: https://support.stripe.com
- Testando Stripe: https://stripe.com/docs/testing

## ✅ Checklist Final

Antes de lançar:

- [ ] Chaves do Stripe configuradas
- [ ] Produtos e preços criados no Stripe
- [ ] Imagens adicionadas e otimizadas
- [ ] Testado localmente
- [ ] Upload para servidor feito
- [ ] HTTPS funcionando
- [ ] Testado em produção com cartão de teste
- [ ] Webhooks configurados (opcional mas recomendado)
- [ ] Email de contato atualizado
- [ ] Links do footer corretos
- [ ] Testado em mobile
- [ ] Testado em diferentes navegadores

---

## 🎉 Pronto!

Sua landing page está configurada e pronta para vender!

**URL Final**: https://stopandgobr.com/plugin

Boa sorte com as vendas! 🏁

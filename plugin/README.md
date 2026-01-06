# Plugin Landing Page - Stop and Go BR

Landing page chamativa e moderna para venda do plugin Stop and Go BR, com integração ao Stripe para pagamentos.

## 📁 Estrutura dos Arquivos

```
plugin/
├── index.html      # Página principal da landing page
├── success.html    # Página de confirmação após pagamento
├── styles.css      # Estilos CSS modernos e responsivos
├── script.js       # JavaScript com integração Stripe e interatividade
├── images/         # Pasta para suas imagens do plugin (crie esta pasta)
└── README.md       # Este arquivo
```

## 🚀 Configuração Rápida

### 1. Configurar Stripe

1. **Obtenha sua chave pública do Stripe:**
   - Acesse: https://dashboard.stripe.com/apikeys
   - Copie sua "Publishable key" (começa com `pk_`)

2. **Crie produtos e preços:**
   - Acesse: https://dashboard.stripe.com/products
   - Crie 3 produtos com assinaturas mensais:
     - **Básico**: R$ 99/mês
     - **Profissional**: R$ 199/mês
     - **Enterprise**: R$ 399/mês
   - Para cada produto, copie o "Price ID" (começa com `price_`)

3. **Atualize o arquivo `script.js`:**
   ```javascript
   // Linha 3: Substitua pela sua chave pública
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_SUA_CHAVE_AQUI';
   
   // Linhas 7-11: Substitua pelos seus Price IDs
   const PRICING_PLANS = {
       basic: 'price_SEU_ID_BASICO',
       professional: 'price_SEU_ID_PROFISSIONAL',
       enterprise: 'price_SEU_ID_ENTERPRISE'
   };
   ```

### 2. Adicionar Suas Imagens

1. Crie a pasta `images` dentro de `plugin/`:
   ```bash
   mkdir -p plugin/images
   ```

2. Adicione suas imagens do plugin com os nomes:
   - `dashboard.jpg` ou `dashboard.png`
   - `telemetry.jpg` ou `telemetry.png`
   - `management.jpg` ou `management.png`

3. Atualize o HTML para usar suas imagens (substitua os placeholders SVG):
   ```html
   <!-- Em index.html, seção gallery -->
   <img src="images/dashboard.jpg" alt="Dashboard Principal">
   <img src="images/telemetry.jpg" alt="Telemetria em Tempo Real">
   <img src="images/management.jpg" alt="Gestão de Campeonatos">
   ```

### 3. Configurar URLs

Atualize os links no footer e páginas conforme seu domínio:
- Site principal: `https://stopandgobr.com`
- Loja: `https://stopandgobr.com/loja`
- Plugin: `https://stopandgobr.com/plugin`

## 📦 Deploy

### Opção 1: Hospedagem Estática (Recomendado para começar)

Você pode hospedar a landing page em qualquer serviço de hospedagem estática:

- **Netlify**: Arraste a pasta `plugin` para netlify.com/drop
- **Vercel**: `vercel deploy` na pasta plugin
- **GitHub Pages**: Commit e push para branch gh-pages

### Opção 2: Servidor Web Tradicional

1. Faça upload da pasta `plugin` para seu servidor
2. Configure o servidor para servir os arquivos em `/plugin`
3. Certifique-se de que o HTTPS está ativo (necessário para Stripe)

### Opção 3: Integração com Site Existente

Se você já tem um site, coloque a pasta `plugin` na raiz:

```
seu-site/
├── index.html          # Seu site principal
├── loja/              # Sua loja
└── plugin/            # Nova landing page
    ├── index.html
    ├── styles.css
    └── script.js
```

## 🎨 Personalização

### Cores

Edite as variáveis CSS em `styles.css` (linhas 9-21):

```css
:root {
    --primary-color: #e63946;      /* Cor principal dos botões */
    --secondary-color: #457b9d;    /* Cor secundária */
    --accent-gold: #ffd60a;        /* Cor de destaque */
    /* ... outras cores */
}
```

### Textos

Todos os textos estão em português no `index.html`. Edite conforme necessário:
- Título e descrição do hero
- Recursos e benefícios
- Perguntas frequentes
- Rodapé

### Preços

Atualize os valores dos planos em `index.html` (seção pricing) se necessário.

## 🔒 Segurança e Boas Práticas

### Backend Recomendado (Produção)

Para produção, é recomendado criar um backend que gerencia o Checkout do Stripe:

```javascript
// No script.js, substitua a função handleCheckout por:
async function handleCheckout(plan) {
    try {
        showLoading();
        
        // Chame seu backend
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });
        
        const { sessionId } = await response.json();
        
        // Redirecione para o Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
            alert('Erro ao processar pagamento.');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
    }
}
```

Exemplo de backend (Node.js):

```javascript
// server.js
const stripe = require('stripe')('sk_live_SUA_SECRET_KEY');

app.post('/api/create-checkout-session', async (req, res) => {
    const { plan } = req.body;
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: PRICING_PLANS[plan],
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${YOUR_DOMAIN}/plugin/success.html`,
        cancel_url: `${YOUR_DOMAIN}/plugin/index.html`,
    });
    
    res.json({ sessionId: session.id });
});
```

### Webhook do Stripe

Configure um webhook para receber notificações de pagamento:

1. Acesse: https://dashboard.stripe.com/webhooks
2. Adicione endpoint: `https://seu-site.com/api/webhook`
3. Selecione eventos: `checkout.session.completed`, `invoice.paid`, etc.
4. Implemente o handler no backend para processar eventos

## 📱 Recursos da Landing Page

### ✨ Recursos Implementados

- ✅ Design moderno e responsivo
- ✅ Animações suaves e atraentes
- ✅ Integração com Stripe Checkout
- ✅ FAQ interativo
- ✅ Scroll suave entre seções
- ✅ Múltiplos planos de preços
- ✅ Seção de benefícios e recursos
- ✅ Galeria de imagens (com placeholders)
- ✅ Loading overlay durante checkout
- ✅ Página de sucesso pós-pagamento
- ✅ 100% responsivo (mobile, tablet, desktop)
- ✅ Otimizado para SEO
- ✅ Acessibilidade

### 🎯 Otimizações

- Lazy loading de imagens (quando implementadas)
- Animações de scroll com Intersection Observer
- Performance otimizada
- CSS minificável para produção

## 🛠️ Manutenção

### Adicionar Novo Plano

1. Crie o produto no Stripe
2. Adicione o card em `index.html` na seção pricing
3. Adicione o Price ID em `script.js` no objeto `PRICING_PLANS`

### Atualizar FAQ

Edite a seção `faq` em `index.html` adicionando novos `faq-item` divs.

### Modificar Recursos

Edite a seção `features` em `index.html` para adicionar/remover cards.

## 📞 Suporte

Para dúvidas sobre implementação:
- Email: contato@stopandgobr.com
- Documentação Stripe: https://stripe.com/docs
- Web Dev: https://developer.mozilla.org

## 📄 Licença

© 2026 Stop and Go BR. Todos os direitos reservados.

---

**Próximos Passos Recomendados:**

1. ✅ Configure suas chaves do Stripe
2. ✅ Adicione suas imagens reais
3. ✅ Teste o fluxo de pagamento em modo test
4. ✅ Configure webhooks do Stripe
5. ✅ Implemente backend para gerenciar checkouts
6. ✅ Configure SSL/HTTPS no seu domínio
7. ✅ Teste em dispositivos móveis
8. ✅ Configure Google Analytics (opcional)
9. ✅ Adicione Facebook Pixel (opcional)
10. ✅ Lance e promova!

🏁 **Boa sorte com seu lançamento!**

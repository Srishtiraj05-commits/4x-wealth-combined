(function() {
  'use strict';

  const knowledge = {
    greetings: {
      keywords: ['hi', 'hello', 'hey', 'namaste', 'hola', 'good morning', 'good afternoon', 'good evening'],
      response: 'Hi there! I\'m <strong>Xiyi</strong>, your 4X Wealth Assistant. How can I help you today — explore services, check calculators, or get in touch?'
    },
    calculators: {
      keywords: ['calculator', 'sip', 'lumpsum', 'swp', 'emi', 'retirement calculator', 'fire calculator', 'calculate'],
      response: 'We have 6 financial calculators: SIP Compounding, Lumpsum Growth, SWP Cash Flow, EMI Loan, Retirement Corpus, and FIRE Freedom. You can try them all at <a href="calculators.html">Financial Calculators</a>.'
    },
    sip: {
      keywords: ['sip calculator', 'sip planning', 'monthly investment'],
      response: 'Our SIP Calculator helps you project wealth with regular or step-up SIPs. <a href="calculators.html#pane-sip">Try SIP Calculator →</a>'
    },
    lumpsum: {
      keywords: ['lumpsum', 'one time investment', 'single investment'],
      response: 'The Lumpsum Planner shows future value of a one-time investment. <a href="calculators.html#pane-lumpsum">Try Lumpsum Calculator →</a>'
    },
    swp: {
      keywords: ['swp', 'systematic withdrawal', 'monthly pension', 'cash flow'],
      response: 'Our SWP Cash Flow Engine models monthly withdrawals while preserving corpus growth. <a href="calculators.html#pane-swp">Try SWP Calculator →</a>'
    },
    emi: {
      keywords: ['emi', 'loan', 'home loan', 'car loan', 'interest rate'],
      response: 'The EMI & Loan Amortization Planner calculates monthly EMIs, total interest, and repayment breakdown. <a href="calculators.html#pane-emi">Try EMI Calculator →</a>'
    },
    retirement: {
      keywords: ['retirement', 'pension', 'nps', 'retire'],
      response: 'We offer Retirement Planning solutions including NPS, mutual fund SIPs, and inflation-adjusted corpus planning. <a href="calculators.html#pane-retirement">Try Retirement Calculator →</a>'
    },
    fire: {
      keywords: ['fire', 'financial independence', 'early retirement'],
      response: 'The FIRE calculator estimates your target corpus and readiness ratio for early retirement. <a href="calculators.html#pane-fire">Try FIRE Calculator →</a>'
    },
    mutualfunds: {
      keywords: ['mutual fund', 'mf', 'fund', 'elss', 'equity fund', 'debt fund'],
      response: '4X Wealth offers diversified mutual fund solutions including equity, debt, hybrid, ELSS tax-saver, and SIP schemes. <a href="mutual-funds.html">Explore Mutual Funds →</a>'
    },
    stocks: {
      keywords: ['stock', 'equity', 'shares', 'direct equity'],
      response: 'We provide direct equity advisory and stock portfolio tracking. <a href="stocks.html">Explore Stocks →</a>'
    },
    etfs: {
      keywords: ['etf', 'exchange traded fund', 'index fund'],
      response: 'ETFs are low-cost index trackers. We help you build an ETF portfolio aligned to your goals. <a href="etfs.html">Explore ETFs →</a>'
    },
    bonds: {
      keywords: ['bond', 'fixed income', 'government bond', 'corporate bond', 'gilt'],
      response: 'Invest in government and corporate fixed-income instruments for stable yields. <a href="bonds.html">Explore Bonds →</a>'
    },
    pms: {
      keywords: ['pms', 'portfolio management', 'discretionary'],
      response: 'Our PMS Desk offers bespoke active portfolio strategies for investments ₹50 lakh and above. <a href="pms.html">Explore PMS →</a>'
    },
    aif: {
      keywords: ['aif', 'alternative investment fund', 'private fund'],
      response: 'We provide access to AIFs across Categories I, II & III, starting from ₹1 Crore. <a href="aif.html">Explore AIF →</a>'
    },
    insurance: {
      keywords: ['insurance', 'life insurance', 'term insurance', 'asset cover'],
      response: 'We offer life and asset insurance solutions to protect your wealth and family. <a href="insurance.html">Explore Insurance →</a>'
    },
    tax: {
      keywords: ['tax', 'elss', 'tax planning', 'tax saving', '80c'],
      response: 'Our Tax Planning services include ELSS, PPF, ULIP, and compliance wrappers to optimize your tax outgo. <a href="tax-planning.html">Explore Tax Planning →</a>'
    },
    nri: {
      keywords: ['nri', 'nre', 'nro', 'fema', 'foreign currency'],
      response: 'Our NRI Wealth Desk handles FEMA-compliant cross-border investments and currency solutions. <a href="nri-services.html">Explore NRI Services →</a>'
    },
    corporate: {
      keywords: ['corporate', 'treasury', 'enterprise', 'company'],
      response: 'Corporate Wealth solutions include treasury optimization, cash-flow management, and enterprise investment mandates. <a href="corporate-wealth.html">Explore Corporate Wealth →</a>'
    },
    unlisted: {
      keywords: ['unlisted', 'pre-ipo', 'private market'],
      response: 'We provide access to pre-IPO and private market unlisted shares. <a href="unlisted-shares.html">Explore Unlisted Shares →</a>'
    },
    giftcity: {
      keywords: ['gift city', 'ifsc', 'cross border'],
      response: 'Our GIFT City IFSC desk supports global and cross-border capital mandates. <a href="gift-city.html">Explore GIFT City →</a>'
    },
    sif: {
      keywords: ['sif', 'specialized investment fund'],
      response: 'SIF Tracker helps screen and track Specialized Investment Funds starting from ₹10 lakh. <a href="sif-tracker.html">Explore SIF →</a>'
    },
    goal: {
      keywords: ['goal', 'goal planning', 'family milestone', 'child education'],
      response: 'Goal-Based Wealth Planning helps you target family milestones like education, marriage, and home purchase. <a href="goal-planning.html">Explore Goal Planning →</a>'
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'call'],
      response: 'You can reach us at:<br>📞 <a href="tel:+919372207675">+91 93722 07675</a><br>✉️ <a href="mailto:info@4xwealthfinancialservices.com">info@4xwealthfinancialservices.com</a><br>📍 Shop No. 101, First Floor, Ganesh Tower, Thane West, Mumbai 400602'
    },
    about: {
      keywords: ['about', 'who', 'company', 'arn', 'amfi', 'apmi', 'registered'],
      response: '4X Wealth Financial Services is an AMFI Registered Mutual Fund Distributor (ARN-268488, valid till 24-04-2026) and APMI Registered PMS Distributor (APRN00969, valid till 04-05-2027). <a href="about.html">Know more →</a>'
    },
    login: {
      keywords: ['login', 'sign up', 'portal', 'account', 'register'],
      response: 'You can log in or sign up as a Retail Investor, Corporate Treasury, or Partner/ARN. Click the Login / Sign Up buttons in the top navigation.'
    },
    fees: {
      keywords: ['fee', 'charges', 'commission', 'cost', 'pricing'],
      response: 'Commission structures vary by product. You can read our Commission Disclosure statement or contact us for a transparent fee discussion.'
    },
    risk: {
      keywords: ['risk', 'safe', 'guarantee', 'market risk'],
      response: 'Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. We do not guarantee returns.'
    },
    thanks: {
      keywords: ['thank', 'thanks', 'dhanyavad'],
      response: 'You\'re welcome! 😊 Feel free to ask anything else. I\'m here to help.'
    },
    bye: {
      keywords: ['bye', 'goodbye', 'see you', 'ok bye'],
      response: 'Goodbye! Have a great day. 👋'
    }
  };

  const quickReplies = [
    { label: 'SIP Calculator', query: 'sip calculator' },
    { label: 'Mutual Funds', query: 'mutual funds' },
    { label: 'Contact Us', query: 'contact' },
    { label: 'Retirement', query: 'retirement planning' }
  ];

  function findResponse(input) {
    const text = input.toLowerCase();
    for (const key in knowledge) {
      const item = knowledge[key];
      if (item.keywords.some(kw => text.includes(kw.toLowerCase()))) {
        return item.response;
      }
    }
    return 'I\'m still learning 🤖. For detailed advice, please call us at <a href="tel:+919372207675">+91 93722 07675</a> or email <a href="mailto:info@4xwealthfinancialservices.com">info@4xwealthfinancialservices.com</a>.';
  }

  function injectStyles() {
    if (document.getElementById('x4-chatbot-styles')) return;
    const css = document.createElement('style');
    css.id = 'x4-chatbot-styles';
    css.textContent = `
      .x4-chat-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0077FF 0%, #00A3FF 60%, #00C6FF 100%);
        color: #fff;
        border: 2.5px solid #BAE6FD;
        box-shadow: 0 8px 25px rgba(0, 119, 255, 0.45);
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .x4-chat-fab:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(0, 163, 255, 0.6); }
      .x4-chat-fab img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        background: #fff;
      }
      .x4-chat-fab.bounce { animation: x4FabBounce 0.5s ease; }
      @keyframes x4FabBounce {
        0%, 100% { transform: scale(1); }
        40% { transform: scale(1.2); }
        60% { transform: scale(0.95); }
      }
      .x4-chat-window {
        position: fixed;
        bottom: 94px;
        right: 24px;
        width: 360px;
        max-width: calc(100vw - 32px);
        height: 520px;
        max-height: calc(100vh - 120px);
        background: #FFFFFF;
        border: 1px solid #BAE6FD;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 119, 255, 0.15);
        display: flex;
        flex-direction: column;
        z-index: 9998;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.96);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .x4-chat-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
      .x4-chat-header {
        background: linear-gradient(135deg, #0055FF 0%, #0077FF 60%, #00C6FF 100%);
        color: #fff;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .x4-chat-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #BAE6FD;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .x4-chat-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .x4-chat-title { flex: 1; }
      .x4-chat-title strong { display: block; font-size: 15px; font-family: var(--font-heading, sans-serif); }
      .x4-chat-title span { font-size: 12px; opacity: 0.9; }
      .x4-chat-close {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 22px;
        cursor: pointer;
        line-height: 1;
      }
      .x4-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #F0F8FF;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .x4-chat-message {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.5;
        color: #0F172A;
        word-wrap: break-word;
      }
      .x4-chat-message a { color: #0077FF; text-decoration: underline; }
      .x4-chat-message.bot {
        align-self: flex-start;
        background: #fff;
        border: 1px solid #BAE6FD;
        box-shadow: 0 2px 8px rgba(0, 119, 255, 0.05);
        border-bottom-left-radius: 4px;
      }
      .x4-chat-message.user {
        align-self: flex-end;
        background: linear-gradient(135deg, #0077FF, #00A3FF);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0, 119, 255, 0.2);
        border-bottom-right-radius: 4px;
      }
      .x4-chat-typing {
        align-self: flex-start;
        display: flex;
        gap: 4px;
        padding: 14px;
      }
      .x4-chat-typing span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #0077FF;
        animation: x4Typing 1.2s infinite ease-in-out;
      }
      .x4-chat-typing span:nth-child(2) { animation-delay: 0.15s; }
      .x4-chat-typing span:nth-child(3) { animation-delay: 0.3s; }
      @keyframes x4Typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }
      .x4-chat-quick {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 4px;
      }
      .x4-chat-chip {
        background: #fff;
        border: 1px solid #BAE6FD;
        color: #0077FF;
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .x4-chat-chip:hover { background: #0077FF; color: #fff; }
      .x4-chat-footer {
        padding: 12px 14px;
        background: #fff;
        border-top: 1px solid #BAE6FD;
        display: flex;
        gap: 10px;
      }
      .x4-chat-input {
        flex: 1;
        border: 1px solid #BAE6FD;
        border-radius: 24px;
        padding: 10px 14px;
        font-size: 14px;
        outline: none;
        color: #0F172A;
      }
      .x4-chat-input:focus { border-color: #0077FF; box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.15); }
      .x4-chat-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0077FF, #00A3FF);
        color: #fff;
        border: none;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 119, 255, 0.3);
      }
      @media (max-width: 480px) {
        .x4-chat-window { right: 16px; bottom: 84px; width: calc(100vw - 32px); }
        .x4-chat-fab { bottom: 16px; right: 16px; }
      }
    `;
    document.head.appendChild(css);
  }

  function createChatUI() {
    if (document.getElementById('x4-chatbot-window')) return;

    const fab = document.createElement('button');
    fab.className = 'x4-chat-fab';
    fab.id = 'x4-chatbot-fab';
    fab.setAttribute('aria-label', 'Open chat');
    fab.innerHTML = '<img src="xiyi-bot.png?v=143.0" alt="Xiyi">';

    const win = document.createElement('div');
    win.className = 'x4-chat-window';
    win.id = 'x4-chatbot-window';
    win.innerHTML = `
      <div class="x4-chat-header">
        <div class="x4-chat-avatar"><img src="xiyi-bot.png?v=143.0" alt="Xiyi"></div>
        <div class="x4-chat-title">
          <strong>Xiyi</strong>
          <span>Your 4X Wealth Assistant</span>
        </div>
        <button class="x4-chat-close" aria-label="Close chat">×</button>
      </div>
      <div class="x4-chat-body" id="x4-chat-body"></div>
      <div class="x4-chat-footer">
        <input type="text" class="x4-chat-input" id="x4-chat-input" placeholder="Type your question..." autocomplete="off">
        <button class="x4-chat-send" id="x4-chat-send" aria-label="Send">➤</button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(win);
  }

  function addMessage(text, sender) {
    const body = document.getElementById('x4-chat-body');
    const msg = document.createElement('div');
    msg.className = `x4-chat-message ${sender}`;
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    const body = document.getElementById('x4-chat-body');
    const typing = document.createElement('div');
    typing.className = 'x4-chat-typing';
    typing.id = 'x4-chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('x4-chat-typing');
    if (typing) typing.remove();
  }

  function addQuickReplies() {
    const body = document.getElementById('x4-chat-body');
    const wrap = document.createElement('div');
    wrap.className = 'x4-chat-quick';
    quickReplies.forEach(qr => {
      const chip = document.createElement('button');
      chip.className = 'x4-chat-chip';
      chip.textContent = qr.label;
      chip.addEventListener('click', () => handleUserMessage(qr.query));
      wrap.appendChild(chip);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function handleUserMessage(text) {
    if (!text || !text.trim()) return;
    const input = document.getElementById('x4-chat-input');
    if (input) input.value = '';
    addMessage(text, 'user');
    showTyping();
    setTimeout(() => {
      removeTyping();
      const reply = findResponse(text);
      addMessage(reply, 'bot');
    }, 600 + Math.random() * 300);
  }

  function init() {
    injectStyles();
    createChatUI();

    const fab = document.getElementById('x4-chatbot-fab');
    const win = document.getElementById('x4-chatbot-window');
    const close = win.querySelector('.x4-chat-close');
    const input = document.getElementById('x4-chat-input');
    const send = document.getElementById('x4-chat-send');
    const body = document.getElementById('x4-chat-body');

    fab.addEventListener('click', () => {
      const isOpen = win.classList.toggle('open');
      if (isOpen) {
        input.focus();
        if (!body.hasChildNodes()) {
          addMessage(knowledge.greetings.response, 'bot');
          addQuickReplies();
        }
      }
    });

    close.addEventListener('click', () => win.classList.remove('open'));

    send.addEventListener('click', () => handleUserMessage(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserMessage(input.value);
    });

    setTimeout(() => {
      fab.classList.add('bounce');
      setTimeout(() => fab.classList.remove('bounce'), 1000);
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

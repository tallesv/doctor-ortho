declare global {
  interface Window {
    PagSeguro: any;
  }
}

const pagSeguroScript = document.createElement('script');
pagSeguroScript.setAttribute(
  'src',
  'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js',
);
document.head.appendChild(pagSeguroScript);

export async function encryptCardPagSeguro(cardData: {
  holder: any;
  number: any;
  expMonth: any;
  expYear: any;
  securityCode: any;
}) {
  const card = await window.PagSeguro.encryptCard({
    publicKey: import.meta.env.VITE_PAGSEGURO_PUBLIC_KEY,
    holder: cardData.holder,
    number: cardData.number,
    expMonth: cardData.expMonth,
    expYear: cardData.expYear,
    securityCode: cardData.securityCode,
  });

  return card;
}

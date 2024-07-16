declare module 'html2pdf.js' {
  const html2pdf: {
    (): {
      from: (element: HTMLElement) => {
        set: (options: any) => {
          save: () => void;
        };
      };
    };
  };
  export default html2pdf;
}
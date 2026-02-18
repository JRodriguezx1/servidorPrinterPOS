

console.log(12);

const selectPrinter = document.querySelector('#selectPrinter') as HTMLSelectElement;
const formSelectPrinter = document.querySelector('#formSelectPrinter') as HTMLFormElement;

interface printerPOS { Name:string, ShareName:string };

(async ()=>{
    try {
        const url = "/api/printPOS/listPrinter"; //llamado a la API REST
        const respuesta = await fetch(url); 
        const resultado = await respuesta.json();
        printPrinterPOS(resultado.data);
    } catch (error) {
        console.log(error);
    }
})();


function printPrinterPOS(printers:printerPOS[]){
    console.log(printers);
    printers.forEach(z=>{
        console.log(z.ShareName);
        const op = document.createElement('option');
        op.textContent = z.ShareName;
        op.value = z.ShareName;
        selectPrinter.append(op);
    });
}


formSelectPrinter.addEventListener('submit', (e:SubmitEvent)=>{
    e.preventDefault();
    console.log((e.submitter as HTMLButtonElement).id);
    const selectPrinter = formSelectPrinter.elements.namedItem("selectPrinter") as HTMLSelectElement;
    console.log(selectPrinter.value);
});
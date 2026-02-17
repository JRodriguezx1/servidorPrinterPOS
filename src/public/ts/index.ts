

console.log(12);

const selectPrinter = document.querySelector('#selectPrinter') as HTMLSelectElement;

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
        selectPrinter.append(op);
    });
}


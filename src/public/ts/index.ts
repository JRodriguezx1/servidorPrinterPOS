
const selectPrinter = document.querySelector('#selectPrinter') as HTMLSelectElement;
const formSelectPrinter = document.querySelector('#formSelectPrinter') as HTMLFormElement;
const logs = document.querySelector('#logs') as HTMLDivElement;


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
    printers.forEach(z=>{
        const op = document.createElement('option');
        op.textContent = z.ShareName;
        op.value = z.ShareName;
        selectPrinter.append(op);
    });
}


formSelectPrinter.addEventListener('submit', (e:SubmitEvent)=>{
    e.preventDefault();
    const printerShare = formSelectPrinter.elements.namedItem("selectPrinter") as HTMLSelectElement;
    if((e.submitter as HTMLButtonElement).id == "testPage")testPrint(printerShare.value);
});

const testPrint = async(printerShare:string):Promise<void>=>{
    const url = "/api/printPOS/testPrinter/"+printerShare; //llamado a la API REST
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    console.log(resultado);
    printLogs(resultado);
}

function printLogs(resultado:{ ok:boolean, jobId:string, message:string, timestamp:string }):void{
    const ok_Text = document.createElement('p');
    ok_Text.classList.add('text-gray-400', 'text-xs');
    const jobId_Text = document.createElement('p');
    jobId_Text.classList.add('text-indigo-300');
    const message_Text = document.createElement('p');
    message_Text.classList.add('text-emerald-400');
    const timestamp_Text = document.createElement('p');
    timestamp_Text.classList.add('text-gray-400', 'text-xs');
    //while(logs.firstChild)logs.removeChild(logs.firstChild);
    message_Text.textContent = resultado.message;
    timestamp_Text.textContent = resultado.timestamp;
    logs.append(message_Text);
    logs.append(timestamp_Text);
    logs.scrollTop = logs.scrollHeight;
}
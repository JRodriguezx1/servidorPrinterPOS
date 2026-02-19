//import { writeFile } from 'fs/promises';
const selectPrinter = document.querySelector('#selectPrinter') as HTMLSelectElement;
const formSelectPrinter = document.querySelector('#formSelectPrinter') as HTMLFormElement;
const logs = document.querySelector('#logs') as HTMLDivElement;
const vaciarCola = document.querySelector('#vaciarCola') as HTMLButtonElement;
const logo = document.querySelector('#logo') as HTMLButtonElement;


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
    if((e.submitter as HTMLButtonElement).id == "testConexion")testPrint(printerShare.value);
    if((e.submitter as HTMLButtonElement).id == "testhardware")testhardware(printerShare.value);
});

const testPrint = async(printerShare:string):Promise<void>=>{
    try {
        const url = "/api/printPOS/testPrinter/"+printerShare; //llamado a la API REST
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        printLogs(resultado);
    } catch (error) {
        console.log(error);
    }
}


async function testhardware(printerShare:string):Promise<void>{
    try {
        const url = "/api/printPOS/statushardware/"+printerShare; //llamado a la API REST
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        printLogs(resultado);
    } catch (error) {
        console.log(error);
    }
}


function printLogs(resultado:{ ok:boolean, jobId:string, message:string, timestamp:string }):void{
    const div = document.createElement('div');
    const ok_Text = document.createElement('p');
    const jobId_Text = document.createElement('p');
    const message_Text = document.createElement('p');
    const timestamp_Text = document.createElement('p');

    ok_Text.classList.add('text-gray-400', 'text-xs');
    jobId_Text.classList.add('text-indigo-300');
    message_Text.className = resultado.ok?'text-emerald-400':'text-red-400';
    timestamp_Text.classList.add('text-gray-400', 'text-xs');

    message_Text.textContent = resultado.message;
    timestamp_Text.textContent = resultado.timestamp;
    div.append(message_Text);
    div.append(timestamp_Text);
    logs.append(div);
    logs.scrollTop = logs.scrollHeight;
    
    if(logs.children.length > 16)logs.removeChild(logs.firstElementChild!);
}


logo.addEventListener('click', async()=>{
    try {
        const url = "/api/file/downloadFile"; //llamado a la API REST
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        printLogs(resultado);
    } catch (error) {
        console.log(error);
    }
});

/*async function downloadLogo(){
    try {
        const url:string = "";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al descargar imagen: ${response.statusText}`);
        }
        // Convertimos la respuesta a un buffer de Node.js
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Guardamos el archivo en la carpeta temporal
        await writeFile('destPath', buffer);
    } catch (error) {
        console.error("Error en downloadLogo con fetch:", error);
        throw error;
    }
}*/
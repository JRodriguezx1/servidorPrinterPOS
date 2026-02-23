const selectPrinter = document.querySelector('#selectPrinter') as HTMLSelectElement;
const formSelectPrinter = document.querySelector('#formSelectPrinter') as HTMLFormElement;
const logs = document.querySelector('#logs') as HTMLDivElement;
const vaciarCola = document.querySelector('#vaciarCola') as HTMLButtonElement;
const logo = document.querySelector('#logo') as HTMLButtonElement;
const iniciarSesion = document.querySelector('#iniciarSesion') as HTMLButtonElement;
const miDialogoIniciarSesion = document.querySelector('#miDialogoIniciarSesion') as any;
const formInicioSesion = document.querySelector('#formInicioSesion') as HTMLFormElement;


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


(async ()=>{
    try {
        const url = "/api/cuenta/getCuenta"; 
        const respuesta = await fetch(url); 
        const resultado = await respuesta.json();
         document.querySelector('#cuentaText')!.textContent = resultado.nombreCuenta;
    } catch (error) {
        console.log(error);
    }
})();


formInicioSesion.addEventListener('submit', (e:SubmitEvent)=>{
    e.preventDefault();
    const cuenta = formInicioSesion.elements.namedItem("nombreCuenta") as HTMLInputElement;
    const password = formInicioSesion.elements.namedItem("password") as HTMLInputElement;
    guardarCuentaDB({nombreCuenta:cuenta.value, password:password.value});
});

const guardarCuentaDB = async(cuenta:{nombreCuenta:string, password:string}):Promise<void>=>{
    try {
        const url = "/api/cuenta/create"; //llamado a la API REST
        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(cuenta)
        });
        const resultado = await respuesta.json();
        if (resultado.valido !== undefined && !resultado?.valido) throw new Error(resultado.message || "Error al crear cuenta");
        printLogs({ok:true, message:"Cuenta creada exitosamente", timestamp:new Date().toISOString(), jobId:""});
        document.querySelector('#cuentaText')!.textContent = cuenta.nombreCuenta;
        formInicioSesion.reset();
    } catch (error) {
        console.log(error);
        printLogs({ok:false, message:(error as Error).message || "Error al crear cuenta", timestamp:new Date().toISOString(), jobId:""});
    }
    miDialogoIniciarSesion.close();
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
        const url = "/api/file/downloadFileLogo"; //llamado a la API REST
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        (document.getElementById("imgLogo") as HTMLImageElement).src = "logo.png?v="+ Date.now();
        printLogs(resultado);
    } catch (error) {
        console.log(error);
    }
});

document.addEventListener("click", cerrarDialogoExterno);
iniciarSesion.addEventListener('click', ()=>{
    
    miDialogoIniciarSesion.showModal();
});


function cerrarDialogoExterno(event:Event) {
    const f = event.target;
    if (f=== miDialogoIniciarSesion || (f as HTMLButtonElement).value =="Cancelar"  || (f as HTMLButtonElement).id == 'btnXCerrarModalAbono' ) {
        miDialogoIniciarSesion.close();
    
    }
}
import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import readXlsxFile from "read-excel-file";
import "./App.css";
import * as XLSX from "xlsx";
function App() {
  // const handlefile=async(e)=>{
  //   const xlfile=e.target.files[0]
  //   const jsonfile=await readXlsxFile(xlfile)
  //   console.log(jsonfile)

  // }
  const fileInputRef = useRef();
  const inputref=useRef();
  const [subject, setsubject] = useState("");
  const [message, setmessage] = useState("");
  const [file, setfile] = useState(null);
  const [emailList, setemailList] = useState([]);
  const [status, setstatus] = useState(false);

  const [mailcount, setmailcount] = useState(0);

  useEffect(()=>{
    inputref.current.focus()
  },[])
  
  const reset=()=>{
    setemailList([])
    setmessage("")
    setfile("")
    setsubject("")
    if (fileInputRef.current) fileInputRef.current.value = null
    console.log("Reset triggered")
  }

  const handlefile = async (e) => {
    setfile(e.target.files[0]);
    const xlfile = e.target.files[0]; //selecting the excel file
    const data = await xlfile.arrayBuffer(); //converting the excel file to binary code
    const workbook = XLSX.read(data); // read the binary code stored in the data
    const sheetname = workbook.SheetNames[0]; //selecting the sheetname to idennftify the sheet
    const worksheet = workbook.Sheets.Sheet1; //selecting the sheet from the excel file using the sheetname
    const jsondata = XLSX.utils.sheet_to_json(worksheet); //converting the excel sheet to json format
    const emailist = jsondata.map((item) => {
      return item.Mail;
    });
    setemailList(emailist);
    setmailcount(jsondata.length);
  };

  const handlesubmit = async () => {
    if (subject === null) {
      return alert("Enter the subject ");
    } else if (message === null) {
      return alert("Enter any message to send");
    } else if (file === null) {
      return alert("Please upload the email file ");
    }

    setstatus(true);

    const newmail = {
      subject: subject,
      message: message,
      mailids: emailList,
    };

    try{


      const api = await fetch("http://localhost:8080/sendmail", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newmail),
      });
      const apires = await api.json();
  
      if (api.ok) {
        setstatus(false)
        setmailcount(0)
        reset()
        alert("Message Sent successfully!");
      } else {
        alert("Failed to Send Mail");
         console.error("❌ Failed to send mail:", result.message);
         setstatus(false)
      }
    }catch(err){
       console.error("❌ Error sending mail:", err.message);
    }

  };

  return (
    <section>
      <div className="bg-green-800 text-white p-2 px-5 py-3 text-3xl text-center">
        Bulk Mail
      </div>
      <div className="bg-green-700 text-white p-2 px-5 py-3  text-2xl text-center">
        We can help your bussiness with sending multiple emails at once{" "}
      </div>
      <div className="bg-green-600 text-white p-2 px-5  py-3  text-2xl text-center">
        Drag and Drop{" "}
      </div>
      <div className="flex flex-col justify-center text-center space-y-5 bg-green-500 px-8 py-3 ">
        <div className="bg-green-500 container flex flex-col items-center flex-wrap justify-center space-x-2">
          <label htmlFor="subject" className="text-xl md:text-2xl mb-2 font-semibold ">
            Subject:{" "}
          </label>
          <input
          value={subject}
          ref={inputref}
            onChange={(e) => {
              setsubject(e.target.value);
            }}
            className="bg-white w-3/4 md:w-1/3  outline-none px-2 rounded py-2 text-lg"
            type="text"
            placeholder="Enter subject message...."
            id="subject"
          />
        </div>
        <div className="bg-white-500 container flex  items-center flex-wrap justify-center  ">
          <textarea
          value={message}
            onChange={(e) => {
              setmessage(e.target.value);
            }}
            name=""
            className="border bg-white text-black outline-none h-48 rounded w-xl resize-none p-2 text-xl"
            placeholder="Enter Your Message...."
          ></textarea>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlefile}
            className=" w-full md:w-fit border-3 p-2 border-dashed border-white file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 hover:file:cursor-pointer dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500 ..."
          />
        </div>
        <div className="">Upload the email file in .xlsx format within 2MB</div>
        <div>
          <p className="text-lg md:text-xl">Total email : {mailcount}</p>
        </div>
        <div>
          <button
            onClick={handlesubmit}
            className="bg-blue-500 text-white px-4 py-2  hover:bg-blue-600 hover:cursor-pointer  rounded "
          >
            {status ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      <div className="hidden h-10 bg-green-400 md:block"></div>
      <div className="hidden h-10 bg-green-300 md:block"></div>
    </section>
  );
}

export default App;

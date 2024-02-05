import React, { memo, useState } from "react";
import {CloseCircleOutlined} from '@ant-design/icons'
import {  List, Popconfirm } from "antd";
import ReportTable from "./ReportTable";
import _ from "lodash";
import DnDReport from "./DnDReport";
const Report = () => {
  const [jsonDataArray, setJsonDataArray] = useState({});
  const [filenames,setfilenames]=useState([]);
  const handleFileChange = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const fileReaders = [];

    
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          setJsonDataArray({ ...jsonDataArray, [file.name]: jsonData });
          setfilenames([...filenames,file.name]);
        } catch (error) {
          console.error(`Error parsing JSON from ${file.name}:`, error);
        }
      };
      reader.readAsText(file);
      fileReaders.push(reader);
    
  };

  const handleProcessData = () => {
    console.log("All JSON Data:", jsonDataArray);
    // You can further process or manipulate the jsonDataArray here
  };
  const remove_file=(item)=>{
    const newobj={...jsonDataArray}
    delete newobj[item];
    setJsonDataArray(newobj)
    setfilenames(filenames.filter((value)=>value!=item));
    
  }
  console.log(jsonDataArray);
  return (
    <div>
      <h1>Report</h1>
      <h2>Upload JSON Files</h2>
      <input type="file" accept=".json"  onChange={handleFileChange} />
      <button onClick={handleProcessData}>log data</button>
   
       
          <div style={{ margin: 10,width:"20%",background:"white",borderRadius:"10px" }}>
            <List
              header={<div>Files Added</div>}
              
              bordered
              dataSource={filenames}
              renderItem={(item,index) => (
                <List.Item
                actions={[<Popconfirm
                  title={`Remove the `+item }
                  onConfirm={()=>remove_file(item)}
                  okText="Yes"
                  cancelText="No"
                ><CloseCircleOutlined title={`Remove the `+item}  /></Popconfirm>]}
                
                >
                   {item}
                </List.Item>
              )}
              
            />
          </div>
           Report Drag and Drop Table 
           

          {/* {!_.isEmpty(jsonDataArray)?<ReportTable data={jsonDataArray} />:""} */}
          {!_.isEmpty(jsonDataArray)?<DnDReport data={jsonDataArray} />:""}
    </div>
  );
};

export default memo(Report);

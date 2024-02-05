import { Result, Table } from "antd";
import React, { useEffect, useState } from "react";
import _, { remove, result, uniq } from "lodash";
const DnDReport = ({ data }) => {
  //   console.log("data from report table ", data);

  const [keys, setkeys] = useState([]);
  const [combData, setCombineData] = useState();
  //combine the keys
  const getkeys = () => {
    const keys = [];
    function isPropertyAnArray(obj, property) {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          for (let objElement of obj[key]) {
            if (property in objElement && Array.isArray(objElement[property])) {
              return true;
            }
          }
        }
      }
      return false;
    }
    function getPropertyType(obj, property) {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Check if the value associated with the key is an array
          if (Array.isArray(obj[key])) {
            // Iterate over elements in the array
            for (let objElement of obj[key]) {
              // Check if the current element has the specified property
              if (property in objElement) {
                // Return the type of the property
                return typeof objElement[property];
              }
            }
          }
        }
      }
      // Property not found
      return null;
    }
    Object.entries(data).forEach(([key, values]) => {
      const ukeys = values.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => acc.add(key)); // Add each key to a Set
        return acc;
      }, new Set());
      // Convert Set to array using Array.from() and spread operator
      const uniqueKeys = Array.from(ukeys);
      // console.log("UK ",uniqueKeys);

      keys.push(
        uniqueKeys.map((uniqueKey) => {
          let object = {
            
            title: uniqueKey.toUpperCase(),
            dataIndex: uniqueKey,
            key: uniqueKey,
          };

          return object;
        })
      );
    });
    //it willreturn in single Array
    let result = keys.reduce((r, e) => (r.push(...e), r), []);

    //result may contain duplicate keys so we have to get rid of it!
    const uniqueObjects = _.uniqWith(result, _.isEqual);
    uniqueObjects.unshift({
      title: "INDEX",
      dataIndex: "Index",
     
      key: "Index",
      render: (text, record, index) => index + 1,
    });
    console.log("All Combined Unique keys ", uniqueObjects);
    //add sorting to unique Columns
    uniqueObjects.forEach((obj) => {
      if (getPropertyType(data, obj.dataIndex) == "string") {
        obj.sorter = (a, b) => a[obj.dataIndex].localeCompare(b[obj.dataIndex]);
      } else if (getPropertyType(data, obj.dataIndex) === "null") {
        obj.render = () => <>-</>;
      } else if (getPropertyType(data, obj.dataIndex) === "number") {
        obj.sorter = (a, b) => a[obj.dataIndex] - b[obj.dataIndex];
      } else if (isPropertyAnArray(data, obj.dataIndex)) {
        obj.render = (a = obj.dataIndex) => <p>{a.join(", ")}</p>;
      }
      
      return obj;
    });
    let uniqueObject=uniqueObjects.filter(item => item.title !== 'KEY')
    console.log("Keys:" ,uniqueObject);
    setkeys(uniqueObject);
  };
  //combine the values of given keys
  const getvalues = () => {
    
    let mergedArray = [];

    let objkeys = Object.keys(data);
    if (objkeys.length === 1) {
      mergedArray = data[objkeys[0]];
    } else {
      function findCommonProperties(data) {
        const keys = Object.keys(data);
        let commonProperties = [];

        if (keys.length > 0) {
          // Initialize with properties of the first array
          commonProperties = Object.keys(data[keys[0]][0]);

          // Iterate through remaining arrays
          for (let i = 1; i < keys.length; i++) {
            const array = data[keys[i]];
            commonProperties = commonProperties.filter((prop) =>
              array.every((obj) => Object.keys(obj).includes(prop))
            );
          }
        }

        return commonProperties;
      }

      // Function to combine arrays of objects based on common properties
      function combineArraysByCommonProperties(data) {
        const combinedArray = [];
        const commonProperties = findCommonProperties(data);

        for (const key in data) {
          const array = data[key];
          array.forEach((obj) => {
            const matchingObjIndex = combinedArray.findIndex((item) =>
              commonProperties.every((prop) => item[prop] === obj[prop])
            );

            if (matchingObjIndex === -1) {
              combinedArray.push({ ...obj });
            } else {
              Object.assign(combinedArray[matchingObjIndex], obj);
            }
          });
        }

        return combinedArray;
      }

      // Combine arrays of objects based on common properties
      const combinedArray = combineArraysByCommonProperties(data);
      
      // console.log("log: ",combinedArray);
      mergedArray = combinedArray;
    }
    mergedArray.forEach((element,i) => {
      element.key=i
    });
    console.log("log: ",mergedArray);

    setCombineData(mergedArray);
  };
  useEffect(() => {
    getkeys();
    getvalues();
  }, [data]);

  // console.log("keys ", keys);
  //   console.log("combdata ", (combData));
  return (
    <React.Fragment>
      {keys.length > 0 ? (
        <Table
          className="custom-table-header"
          style={{ margin: 10 }}
          columns={keys}
          dataSource={combData}
          key={1}
        />
      ) : (
        <Result title="No Report Seleted till" />
      )}
    </React.Fragment>
  );
};

export default DnDReport;

import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

export default function KoalaTabulka({dataInJson}) {

  //setData je funkce, které předáme nové hodnoty, v data jsou aktuální hodnoty
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios.get(dataInJson);
      setData(result.data);  //načtení dat do proměnné data
    })();
  }, []);

  //definování sloupců tabulky
  const columnsTableDefault = useMemo( // - buňka se šipkou, pak sloupce a nakonec buňka s křížkem
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {
              //expand jen pokud existuje kid pro akutální řádek
              Object.keys(data[row.index].kids).length === 0 ? null :
                row.isExpanded ? '👇' : '👉'    //je řádek expandovaný? 
            }
          </span>
        ),
      },
      {
        Header: "tabulka s daty vykreslená s využitím react-table",
        columns: [
          {
            Header: "Identification number",
            accessor: "data.Identification number"
          },
          {
            Header: "Name",
            accessor: "data.Name"
          },
          {
            Header: "Gender",
            accessor: "data.Gender"
          },
          {
            Header: "Risk",
            accessor: "data.Risk"
          },
          {
            Header: "Hair length",
            accessor: "data.Hair length"
          },
          {
            Header: "IQ",
            accessor: "data.IQ"
          },
          {
            Header: "Admission date",
            accessor: "data.Admission date"
          },
          {
            Header: "Last breakdown",
            accessor: "data.Last breakdown"
          },
          {
            Header: "Yearly fee",
            accessor: "data.Yearly fee"
          },
          {
            Header: "Knows the Joker?",
            accessor: "data.Knows the Joker?"
          }
        ]
      },

      {//převzato a upraveno z https://codesandbox.io/s/react-table-delete-particular-item-k0xqf?file=/src/App.js
        Header: () => null,
        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps) => (
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              const dataCopy = [...data];
              //smazání řádku tabulky (řádek je jeden prvek v poli)                           
              dataCopy.splice(tableProps.row.index, 1);
              setData(dataCopy);
            }}
          >
            X
          </span>
        )
      }
    ],
    [data]
  );

  //definování sloupců v SubComponentě
  function columnsTableLevel1(parentRowIndex) {
    return ([
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {
              //expand jen pokud existuje kid pro akutální řádek
              Object.keys(data[parentRowIndex].kids.has_relatives.records[row.index].kids).length === 0 ? null :
                row.isExpanded ? '👇' : '👉'    //je řádek expandovaný?
            }
          </span>
        ),
      },
      {
        Header: "has_relatives",
        columns: [
          {
            Header: "Relative ID",
            accessor: "data.Relative ID",
          },
          {
            Header: "Patient ID",
            accessor: "data.Patient ID"
          },
          {
            Header: "Is alive?",
            accessor: "data.Is alive?"
          },
          {
            Header: "Frequency of visits",
            accessor: "data.Frequency of visits"
          }
        ]
      },
      {//převzato a upraveno z https://codesandbox.io/s/react-table-delete-particular-item-k0xqf?file=/src/App.js
        Header: () => null,
        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps) => (
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              const dataCopy = [...data];
              //smazání řádku tabulky (řádek je jeden prvek v poli)                         
              dataCopy[parentRowIndex].kids.has_relatives.records.splice(tableProps.row.index, 1);
              setData(dataCopy);
            }}
          >
            X
          </span>
        )
      }
    ]);
  }

  //definování sloupců v SubComponentě SubComponenty
  function columnsTableLevel2(parentRow) {
    return ([
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {
              // row.isExpanded ? '👇' : '👉'    //level3 není v examples, ale jinak by tu byla podmínka: pokud existuje kid 
            }
          </span>
        ),
      },
      {
        Header: "has_phone",
        columns: [
          {
            Header: "Phone ID",
            accessor: "data.Phone ID"
          },
          {
            Header: "ID of the relative",
            accessor: "data.ID of the relative"
          },
          {
            Header: "Phone",
            accessor: "data.Phone"
          }
        ],
      },
      {//převzato a upraveno z https://codesandbox.io/s/react-table-delete-particular-item-k0xqf?file=/src/App.js
        Header: () => null,
        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps) => (
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              const dataCopy = [...data];
              //smazání řádku tabulky (řádek je jeden prvek v poli)                            
              dataCopy[parentRow.parent.index].kids.has_relatives.records[parentRow.index].kids.has_phone.records.splice(tableProps.row.index, 1);
              setData(dataCopy);
            }}
          >
            X
          </span>
        )
      }
    ]);
  }

  //funkce, která vytvoří tabulku v subComponentě
  const tabulkaLevel1 = React.useCallback(
    ({ row, parentRowIndex }) => (
      <pre>
        <Table columns={
          columnsTableLevel1(row.index) //předání čísla řádku, kvůli detekci, zda lze řádek expandovat - tady by taky měl být taky ten stromový object parent
        } data={Object(data[row.index].kids.has_relatives.records)
        } renderRowSubComponent={tabulkaLevel2} parentRowIndex={row.index} />
      </pre>
    ),
    [data]
  )

  //funkce, která vytvoří tabulku v subComponentě SubComponenty
  const tabulkaLevel2 = React.useCallback(
    ({ row, parentRowIndex }) => (
      <pre>
        {Object.keys(data[parentRowIndex].kids.has_relatives.records[row.index].kids).length === 0 ? null :
          <Table columns={columnsTableLevel2({ index: row.index, parent: { index: parentRowIndex } })} data={Object(data[parentRowIndex].kids.has_relatives.records[row.index].kids.has_phone.records)
          } renderRowSubComponent={null} parentRowIndex={row.index} />}
      </pre>
    ),
    [data]
  )

  //vykreslení defaultní tabulky (level 0) se skrytou subKomponentou ke každému řádku tabulky
  return (
    <div className="Table">
      <Table columns={columnsTableDefault} data={data} renderRowSubComponent={tabulkaLevel1
      } parentRowIndex={0} /> {/*  předání parametrů do Table.jsx a vykreslení tabulky z importu */}
    </div>
  );
}

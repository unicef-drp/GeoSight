import React, { useEffect, useState } from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import Harvesters from '../../Harvesters'
import { SelectWithList } from "../../../../components/Input/SelectWithList";

import './style.scss';


/**
 * MetaIngestor App
 */
export default function MetaIngestor() {
  const sheetName = "sheet_name";
  const rowNumberHeader = "row_number_for_header";
  const admCodeName = "column_name_administration_code";

  const attributesInputs = []
  const mappingInputs = []
  const [workbook, setWorkbook] = useState(null);

  // When file changed
  const fileChanged = (attribute, evt) => {
    let workbook = null;
    const file = evt.target.files[0];
    const fr = new FileReader();
    fr.onload = function () {
      workbook = XLSX.read(fr.result, {
        type: 'binary'
      });

      const sheetsOptions = []
      workbook.Workbook.Sheets.map(sheet => {
        if (sheet.Hidden === 0) {
          sheetsOptions.push(sheet.name)
        }
      })
      const sheetAttribute = attributes.filter(attr => {
        return attr.name === sheetName
      })[0]
      sheetAttribute.options = sheetsOptions
      sheetAttribute.value = sheetsOptions[0]

      const rowNumber = attributes.filter(attr => {
        return attr.name === rowNumberHeader
      })[0]
      if (!rowNumber.value) {
        rowNumber.value = 1
      }
      // Set all states
      setAttributes([...attributes])
      setWorkbook(workbook)
    }
    fr.readAsBinaryString(file)
  }

  // Default Format all data
  attributesData.map(attribute => {
    if (isNaN(attribute.name)) {
      switch (attribute.name) {
        case "file":
          attribute.onChange = fileChanged
          break
      }
      attributesInputs.push(attribute)
    } else {
      mappingInputs.push(attribute)
    }
  })

  const [attributes, setAttributes] = useState(attributesInputs);
  const [mappingAttributes, setMappingAttributes] = useState(mappingInputs);


  // When Sheet changed
  const SheetChanged = (attribute, evt) => {
    attribute.value = evt.target.value
    if (workbook) {
      const rowNumber = attributes.filter(attr => {
        return attr.name === rowNumberHeader
      })[0]
      const array = XLSX.utils.sheet_to_json(workbook.Sheets[evt.target.value], {
        header: 1,
        defval: '',
        blankrows: true
      });

      const admCode = attributes.filter(attr => {
        return attr.name === admCodeName
      })[0]

      const headers = array[rowNumber.value - 1] ? array[rowNumber.value - 1] : []
      admCode.options = headers
      admCode.value = findMostMatched(admCode.options, 'pcode').value

      // CHECK THE ATTRIBUTES
      mappingAttributes.map(attribute => {
        attribute.options = headers
        const name = attribute.data.name
        const shortcode = attribute.data.shortcode
        const {
          value: valueName,
          score: scoreName
        } = findMostMatched(admCode.options, name)
        const {
          value: valueShortcode,
          score: scoreShortcode
        } = findMostMatched(admCode.options, shortcode)
        if (valueName && valueShortcode) {
          if (scoreName < scoreShortcode) {
            attribute.value = valueName
          } else {
            attribute.value = valueShortcode
          }
        } else if (valueName) {
          attribute.value = valueName
        } else if (valueShortcode) {
          attribute.value = valueShortcode
        }
      })
      setMappingAttributes([...mappingAttributes])
    }
    setAttributes([...attributes])
  }
  /** When workbook changed */
  useEffect(() => {
    if (workbook) {
      const sheetAttribute = attributes.filter(attr => {
        return attr.name === sheetName
      })[0]
      sheetAttribute.onChange = SheetChanged
      SheetChanged(
        sheetAttribute, { target: { value: sheetAttribute.value } }
      )

      const rowNumberAttribute = attributes.filter(attr => {
        return attr.name === rowNumberHeader
      })[0]
      rowNumberAttribute.onChange = (attribute, evt) => {
        attribute.value = evt.target.value
        sheetAttribute.onChange = SheetChanged
        setAttributes([...attributes])
        SheetChanged(
          sheetAttribute, { target: { value: sheetAttribute.value } }
        )
      }
    }
  }, [workbook]);

  return (
    <Harvesters attributes={attributes} setAttributes={setAttributes}>
      <table className='IndicatorSelection'>
        <tbody>
        <tr>
          <th colSpan={2}>Indicator Mapping</th>
        </tr>
        {
          mappingAttributes.map(attribute => {
            return (
              <tr key={attribute.name}>
                <td>{
                  attribute.value ?
                    <span className='HasClass'></span> : ''
                } {attribute.title}</td>
                <td>
                  <SelectWithList
                    name={'attribute_' + attribute.name}
                    list={attribute.options}
                    value={attribute.value}
                    onChange={evt => {
                      attribute.value = evt.value
                      setMappingAttributes([...mappingAttributes])
                    }}/>
                </td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </Harvesters>
  );
}


render(MetaIngestor, store)
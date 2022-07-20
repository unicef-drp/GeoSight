import React from 'react';
import DatePicker from "react-datepicker";
import Moment from 'moment';
import Admin, { pageNames } from '../index';
import { SaveButton } from "../../../components/Elements/Button";
import { SelectWithList } from "../../../components/Input/SelectWithList";

import './style.scss';


/** Harvesters App
 * @param {Array} attributes Attributes of data.
 * @param {Function} setAttributes Set Attribute Functions.
 * @param {React.Component} children React component to be rendered
 */
export default function Harvesters(
  { attributes, setAttributes, children }
) {

  let help = harvestersData.filter(harvester => {
    return harvesterClass === harvester.value
  })[0].description


  /** Input function */
  const input = (attribute) => {
    const name = 'attribute_' + attribute.name
    const required = attribute.required
    switch (attribute.type) {
      case "number":
        return (
          <input
            type='number'
            required={required}
            name={name}
            value={attribute.value}
            onChange={
              evt => {
                if (attribute.onChange) {
                  attribute.onChange(attribute, evt)
                } else {
                  attribute.value = evt.target.value
                  setAttributes([...attributes])
                }
              }
            }/>
        )
      case "date":
        return (
          <DatePicker
            name={name}
            required={required}
            dateFormat="yyyy-MM-dd"
            selected={attribute.value ? new Date(attribute.value) : ""}
            onChange={date => {
              attribute.value = Moment(date).format('YYYY-MM-DD')
              setAttributes([...attributes])
            }
            }
          />
        )
      case "select": {
        return (
          <SelectWithList
            name={name}
            list={attribute.options}
            value={attribute.value}
            required={required}
            onChange={evt => {
              evt = {
                target: {
                  value: evt.value
                }
              }
              if (attribute.onChange) {
                attribute.onChange(attribute, evt)
              } else {
                attribute.value = evt.target.value
                setAttributes([...attributes])
              }
            }}/>
        )
      }
      case "file": {
        return (
          <input
            type="file"
            name={name}
            accept={attribute.file_accept}
            onChange={evt => {
              if (attribute.onChange) {
                attribute.onChange(attribute, evt)
              }
            }}/>
        )
      }
      default:
        return (
          <input
            name={name}
            required={required}
            disabled={attribute.read_only}
            type='text'
            value={attribute.value}
            onChange={
              evt => {
                if (attribute.onChange) {
                  attribute.onChange(attribute, evt)
                } else {
                  attribute.value = evt.target.value
                  setAttributes([...attributes])
                }
              }
            }/>
        )
    }
  }
  return (
    <form id="BasicForm" method="post" encType="multipart/form-data">
      <Admin
        pageName={pageNames.Indicators}
        rightHeader={
          <SaveButton
            variant="secondary"
            text="Submit"
            type="submit"
          />
        }
      >
        <div className='HarvesterForm'>
          <div className="BasicFormSection">
            <span className="form-input">
              <input type="hidden" name="csrfmiddlewaretoken"
                     value={csrfmiddlewaretoken}/>
            </span>
          </div>

          <div className="BasicFormSection">
            <label className="form-label required" htmlFor="group">
              Harvester
            </label>
            <SelectWithList
              list={harvestersData} value={harvesterClass} name='harvester'/>
            <div>
              <span className='form-helptext'
                    dangerouslySetInnerHTML={{ __html: help }}/>
            </div>
          </div>

          {
            attributes.map(attribute => {
              return (
                <div key={attribute.name} className="BasicFormSection">
                  <label
                    className={"form-label " + (attribute.required ? 'required' : '')}>
                    {attribute.title}
                  </label>
                  {input(attribute)}
                  <span className='form-helptext'
                        dangerouslySetInnerHTML={{ __html: attribute.description }}/>
                </div>
              )
            })
          }

          {children ? children : ''}
        </div>
      </Admin>
    </form>
  );
}
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'
import { FormControl } from "@mui/material";

import { fetchingData } from "../../../../../Requests";
import Actions from "../../../../../redux/actions/dashboard";
import { GeorepoUrls } from '../../../../../utils/georepo'

/**
 * Summary dashboard
 */
export default function SummaryDashboardForm() {
  const {
    icon,
    name,
    description,
    group,
    referenceLayer
  } = useSelector(state => state.dashboard.data);
  const dispatch = useDispatch();

  const imageName = (icon) => {
    return icon ? icon.split('/')[icon.split('/').length - 1] : 'No Image'
  }

  const [nameData, setNameData] = useState(name);
  const [descriptionData, setDescriptionData] = useState(description);
  const [groupData, setGroupData] = useState(group);
  const [iconSrc, setIconSrc] = useState(icon);
  const [iconName, setIconName] = useState(imageName(icon));

  const [referenceLayerList, setReferenceLayerList] = useState(null);
  const [referenceLayerOptions, setReferenceLayerOptions] = useState([]);

  // Fetch data
  useEffect(() => {
    fetchingData(GeorepoUrls.ReferenceList, {}, {}, (data) => {
      const options = []
      data.map(row => {
        row.detail_url = GeorepoUrls.ReferenceDetail(row.identifier)
        options.push({
          value: row.identifier,
          label: row.name + ' (' + row.identifier + ')'
        })
      })
      setReferenceLayerList(data);
      setReferenceLayerOptions(options)
    })
  }, [])

  /** Image changed */
  const imageChanged = (event) => {
    const [file] = event.target.files
    if (file) {
      setIconSrc(URL.createObjectURL(file));
      setIconName(file.name);
    } else {
      setIconSrc(icon);
      setIconName(imageName(icon));
    }
  }

  // Check init value
  let initValue = referenceLayerOptions.filter(option => {
    return option.value === referenceLayer.identifier
  })

  return (
    <div className='Summary'>
      <div id="BasicForm" className='AdminForm'>
        <div className="BasicFormSection">
          <div>
            <label className="form-label required" htmlFor="name">
              Reference Dataset
            </label>
          </div>
          <div>
              <span className="form-input">
                {
                  referenceLayerList ?
                    <Select
                      options={referenceLayerOptions}
                      value={initValue ? initValue[0] : ''}
                      onChange={(evt) => {
                        const selected = referenceLayerList.filter(row => {
                          return evt.value === row.identifier
                        })[0]
                        dispatch(Actions.ReferenceLayer.update(selected));
                      }}
                    /> :
                    <Select placeholder='Loading'/>
                }
              </span>
          </div>
        </div>
        <div className="BasicFormSection">
          <div>
            <label className="form-label required" htmlFor="name">Name</label>
          </div>
          <div>
              <span className="form-input">
              <input id="SummaryName" type="text" name="name" required={true}
                     value={nameData}
                     onChange={(event) => {
                       setNameData(event.target.value)
                     }}/>
              </span>
          </div>
        </div>
        <div className="BasicFormSection">
          <div>
            <label className="form-label" htmlFor="name">Description</label>
          </div>
          <div>
              <span className="form-input">
              <textarea id="SummaryDescription" name="description"
                        value={descriptionData} rows="4"
                        onChange={(event) => {
                          setDescriptionData(event.target.value)
                        }}/>
              </span>
          </div>
        </div>
        <FormControl className='IconInput'>
          <label
            className="MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-root MuiFormLabel-colorPrimary MuiFormLabel-filled css-1sumxir-MuiFormLabel-root-MuiInputLabel-root"
            data-shrink="true">Icon</label>
          <div className='IconInputPreview'>
            <div
              className="MuiInput-root MuiInput-underline MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-formControl css-1ptx2yq-MuiInputBase-root-MuiInput-root">
              {iconName}
              <input id="SummaryIcon" type="file" name="icon"
                     accept="image/png, image/jpeg"
                     onChange={imageChanged}/>
            </div>
            {iconSrc ? <img src={iconSrc}/> : ''}
          </div>
        </FormControl>
        <div className="BasicFormSection">
          <div>
            <label className="form-label" htmlFor="name">
              Category
            </label>
          </div>
          <div>
              <span className="form-input">
              <input id="SummaryCategory" type="text" name="category"
                     required={true} value={groupData}
                     onChange={(event) => {
                       setGroupData(event.target.value)
                     }}/>
              </span>
          </div>
        </div>
        <div className="BasicFormSection">
          <div>
            <label className="form-label required" htmlFor="name">
              Extent
            </label>
          </div>
          <div>
            Go to Preview and move to the map to place that you want.
          </div>
        </div>
      </div>
    </div>
  )
}
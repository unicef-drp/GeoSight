import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { FormControl } from "@mui/material";

/**
 * Summary dashboard
 */
export default function SummaryDashboardForm() {
  const {
    icon,
    name,
    description,
    group,
  } = useSelector(state => state.dashboard.data);

  const imageName = (icon) => {
    return icon ? icon.split('/')[icon.split('/').length - 1] : 'No Image'
  }

  const [nameData, setNameData] = useState(name);
  const [descriptionData, setDescriptionData] = useState(description);
  const [groupData, setGroupData] = useState(group);
  const [iconSrc, setIconSrc] = useState(icon);
  const [iconName, setIconName] = useState(imageName(icon));

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

  return (
    <div className='Summary'>
      <div id="BasicForm" className='AdminForm'>
        <div className="BasicFormSection">
          <div>
            <label className="form-label required" htmlFor="name">Name</label>
          </div>
          <div>
              <span className="form-input">
              <input type="text" name="name" required={true} value={nameData}
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
              <textarea name="name" value={descriptionData} rows="4"
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
              <input type="file" name="icon"
                     accept="image/png, image/jpeg"
                     onChange={imageChanged}/>
            </div>
            {iconSrc ? <img src={iconSrc}/> : ''}
          </div>
        </FormControl>
        <div className="BasicFormSection">
          <div>
            <label className="form-label required" htmlFor="name">
              Category
            </label>
          </div>
          <div>
              <span className="form-input">
              <input type="text" name="name" required={true} value={groupData}
                     onChange={(event) => {
                       setGroupData(event.target.value)
                     }}/>
              </span>
          </div>
        </div>
      </div>
    </div>
  )
}
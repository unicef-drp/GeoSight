import React, { useEffect, useState } from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AddButton, SaveButton } from "../../../../components/Elements/Button";
import Admin, { pageNames } from '../../index';
import AdminForm from '../../Components/Form'

import './style.scss';

/**
 * Indicator Rule
 * @param {dict} rule Rule.
 * @param {int} idx Index.
 * @param {Function} onDelete OnDelete.
 */
export function IndicatorRule({ rule, idx, onDelete }) {
  const ruleNameName = 'rule_name_' + idx;
  const ruleNameRule = 'rule_rule_' + idx;
  const ruleNameColor = 'rule_color_' + idx;
  const ruleNameOutlineColor = 'rule_outline_color_' + idx;

  const deleteRow = () => {
    onDelete(idx)
  }
  const [ruleValue, setRuleValue] = useState(rule.rule);
  const [equal, setEqual] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [color, setColor] = useState(rule.color);
  const [outlineColor, setOutlineColor] = useState(rule.outline_color);

  // Construct rule
  useEffect(() => {
    let newRule = '';
    if (equal !== '') {
      newRule = 'x==' + equal;
    } else if (min !== '' || max !== '') {
      const values = []
      if (min) {
        values.push('x>' + min)
      }
      if (max) {
        values.push('x<=' + max)
      }
      newRule = values.join(' and ');
    }
    setRuleValue(newRule);
  }, [equal, min, max])

  // Return rule value
  useEffect(() => {
    const value = rule.rule.replaceAll(' ', '');
    const values = value.split('and');
    values.forEach(currentValue => {
      if (value.indexOf("==") >= 0) {
        if (value.split('==')[0] === 'x') {
          setEqual(value.split('==')[1])
        } else {
          setEqual(value.split('==')[0])
        }
      } else if (currentValue.indexOf("<") >= 0) {
        if (currentValue.split('<')[0] === 'x') {
          setMax(currentValue.split('<')[1].replace('=', ''))
        } else {
          setMax(currentValue.split('<')[0].replace('=', ''))
        }
      } else if (currentValue.indexOf(">") >= 0) {
        if (currentValue.split('>')[0] === 'x') {
          setMin(currentValue.split('>')[1].replace('=', ''))
        } else {
          setMin(currentValue.split('>')[0].replace('=', ''))
        }
      }
    })
  }, [rule])

  return (
    <tr>
      <td>
        <RemoveCircleIcon
          className='MuiButtonLike RemoveButton' onClick={deleteRow}/>
      </td>
      <td>
        <input type="text" name={ruleNameName} defaultValue={rule.name}
               spellCheck="false"/>
      </td>
      <td>
        <div className='RuleSectionCell'>
          <input type="text" className="IndicatorRuleValue"
                 name={ruleNameRule}
                 value={ruleValue}
                 onChange={(evt) => {
                   setRuleValue(evt.target.value)
                 }}/>
          <div className="RuleSection">
            <div className="RuleSectionSymbol">value</div>
            <div className="RuleSectionSymbol">=</div>
            <div>
              <input
                type="number" spellCheck="false"
                value={equal}
                disabled={!!(min !== '' || max !== '')}
                onChange={(evt) => {
                  setEqual(evt.target.value)
                  setMin('')
                  setMax('')
                }}
              />
            </div>
          </div>
          <div className="RuleSection OrSection">
            <div className="RuleSectionSymbol">or</div>
          </div>
          <div className="RuleSection">
            <div>
              <input
                type="number" spellCheck="false" className="RuleSectionMin"
                step="any" value={min}
                disabled={equal !== ''}
                onChange={(evt) => {
                  setMin(evt.target.value)
                  setEqual('')
                }}/>
            </div>
            <div
              className="RuleSectionSymbol RuleSectionSymbolLeft">{'<'}</div>
            <div className="RuleSectionSymbol">value</div>
            <div className="RuleSectionSymbol">{'<='}</div>
            <div>
              <input
                type="number" spellCheck="false" className="RuleSectionMax"
                step="any" value={max}
                disabled={equal !== ''}
                onChange={(evt) => {
                  setMax(evt.target.value)
                  setEqual('')
                }}/>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className='RuleSectionColor'>
          <input type="text" name={ruleNameColor} value={color}
                 onChange={evt => setColor(evt.target.value)}
                 spellCheck="false"/>
          <div className='RuleSectionColor-Preview'>
            <input type="color" spellCheck="false" value={color}
                   onChange={evt => setColor(evt.target.value)}/>
          </div>
        </div>
      </td>
      <td>
        <div className='RuleSectionColor'>
          <input type="text" name={ruleNameOutlineColor} value={outlineColor}
                 onChange={evt => setOutlineColor(evt.target.value)}
                 spellCheck="false"/>
          <div className='RuleSectionColor-Preview'>
            <input type="color" spellCheck="false" value={outlineColor}
                   onChange={evt => setOutlineColor(evt.target.value)}/>
          </div>
        </div>
      </td>
    </tr>
  )
}

/**
 * Indicator Form App
 */
export default function IndicatorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [rules, setRules] = useState(indicatorRules);

  /** Render **/
  const submit = () => {
    setSubmitted(true)
  }

  /** On delete a row of rule **/
  const onDelete = (idx) => {
    rules.splice(idx, 1);
    setRules([...rules]);
  }

  /** Adding new rule **/
  const addNewRule = () => {
    let idx = Math.max(...rules.map(rule => {
      return rule.id
    }))
    setRules(
      [...rules,
        {
          "id": idx + 1,
          "name": "",
          "rule": "",
          "color": "#000000",
          "outline_color": "#000000"
        }]
    )
  }

  return (
    <Admin
      className='Indicator'
      pageName={pageNames.Indicators}
      rightHeader={
        <SaveButton
          variant="secondary"
          text="Submit"
          onClick={submit}
          disabled={submitted ? true : false}
        />
      }>

      <AdminForm isSubmitted={submitted}>
        <div className='RuleTable-Title'>Color Rule</div>
        <table id="RuleTable">
          <thead>
          <tr className="RuleTable-Header">
            <th></th>
            <th valign="top">Name</th>
            <th valign="top">Rule</th>
            <th valign="top">Color</th>
            <th valign="top">Outline Color</th>
          </tr>
          <tr className="RuleTable-Help">
            <th valign="top"></th>
            <th valign="top" colSpan="2">
              <div>
                The values for each rule can either be:
                <ul>
                  <li>{
                    `Text-based items that map to a number (e.g.
                    'Worsening' maps to value '1'). In this case, you
                    should use the '=' box below to declare one value
                    per rule text option. When harvesting from a
                    datasource, that
                    datasource can contain either numeric or text
                    values for the indicator.`
                  }
                  </li>
                  <li>{
                    `Number based items in a range that map to a
                    rule (e.g. '1 to 5' maps to 'Worsening'). In
                    this case, use the upper and lower range options
                    individually or together to define the ranges (e.g.
                    'Worsening' <= 5,
                    'Better' > 5 and <= 10). When harvesting from a
                    datasource, that datasource can contain ONLY
                    numeric values for the indicator.`
                  }</li>
                </ul>
              </div>
            </th>
            <th valign="top">
                <span>
                    Used for coloring the traffic light or filling the geometry.
                    Put the hex color with # (e.g. #ffffff) or put the text of color. (e.g. blue).
                </span>
            </th>
            <th valign="top">
                <span>
                    Used for coloring the outline of the geometry.
                    Put the hex color with # (e.g. #ffffff) or put the text of color. (e.g. blue).
                </span>
            </th>
          </tr>
          </thead>
          <tbody>
          {
            rules.map((rule, idx) => {
              return <IndicatorRule key={rule.id} rule={rule} idx={idx}
                                    onDelete={onDelete}/>
            })
          }
          <tr className='IndicatorRule-Divider'>
            <td colSpan={5}>
            </td>
          </tr>
          <tr className='IndicatorRule-Add'>
            <td colSpan={5}>
              <AddButton
                variant="secondary"
                text="Add New Rule"
                onClick={addNewRule}
              />
            </td>
          </tr>
          </tbody>
        </table>
      </AdminForm>
    </Admin>
  );
}

render(IndicatorForm, store)
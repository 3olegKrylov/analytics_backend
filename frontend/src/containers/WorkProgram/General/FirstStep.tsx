import React from 'react';
import get from 'lodash/get';
import classNames from 'classnames';
import moment, {Moment} from "moment";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import {DatePicker} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DateIcon from "@material-ui/icons/DateRange";
import AddIcon from "@material-ui/icons/Add";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Chip from "@material-ui/core/Chip";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";

import InputsLoader from '../../../components/InputsLoader';
import SimpleSelector from '../../../components/SimpleSelector';
import SpecializationSelector from './Specialization';

import UserSelector from "../../Profile/UserSelector";
import SearchSelector from "../../../components/SearchSelector";

import {FirstStepProps} from './types';
import {WorkProgramGeneralFields} from "../enum";
import {FULL_DATE_FORMAT, getUserFullName} from "../../../common/utils";
import {languageObject, specializationObject, languageArray, implementationFormats} from "../constants";
import {UserFields} from "../../../layout/enum";

import connect from './FirstStep.connect';
import styles from './FirstStep.styles';
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class FirstStep extends React.Component<FirstStepProps> {
  state = {
    [WorkProgramGeneralFields.CODE]: '',
    [WorkProgramGeneralFields.TITLE]: '',
    [WorkProgramGeneralFields.APPROVAL_DATE]: '',
    [WorkProgramGeneralFields.AUTHORS]: '',
    [WorkProgramGeneralFields.DESCRIPTION]: '',
    [WorkProgramGeneralFields.VIDEO_LINK]: '',
    [WorkProgramGeneralFields.QUALIFICATION]: '',
    [WorkProgramGeneralFields.EXTRA_POINTS]: '',
    [WorkProgramGeneralFields.LANGUAGE]: '',
    [WorkProgramGeneralFields.BARS]: false,
    [WorkProgramGeneralFields.SEMESTER_COUNT]: 1,
    [WorkProgramGeneralFields.IMPLEMENTATION_FORMAT]: undefined,
    addEditorsMode: false
  };

  componentDidMount() {
    this.props.structuralUnitActions.getStructuralUnits();

    this.setState({
      [WorkProgramGeneralFields.TITLE]: this.props.title,
      [WorkProgramGeneralFields.CODE]: this.props.code,
      [WorkProgramGeneralFields.APPROVAL_DATE]: this.props.date,
      [WorkProgramGeneralFields.AUTHORS]: this.props.authors,
      [WorkProgramGeneralFields.DESCRIPTION]: this.props.description,
      [WorkProgramGeneralFields.VIDEO_LINK]: this.props.video,
      [WorkProgramGeneralFields.QUALIFICATION]: this.props.qualification,
      [WorkProgramGeneralFields.LANGUAGE]: this.props.language,
      [WorkProgramGeneralFields.SEMESTER_COUNT]: this.props.semesterCount,
      [WorkProgramGeneralFields.BARS]: this.props.bars,
      [WorkProgramGeneralFields.IMPLEMENTATION_FORMAT]: this.props.implementationFormat,
    })
  }

  componentDidUpdate(prevProps: Readonly<FirstStepProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.title !== this.props.title || prevProps.code !== this.props.code ||
      prevProps.authors !== this.props.authors || prevProps.date !== this.props.date) {
      this.setState({
        [WorkProgramGeneralFields.TITLE]: this.props.title,
        [WorkProgramGeneralFields.CODE]: this.props.code,
        [WorkProgramGeneralFields.APPROVAL_DATE]: this.props.date,
        [WorkProgramGeneralFields.AUTHORS]: this.props.authors,
        [WorkProgramGeneralFields.DESCRIPTION]: this.props.description,
        [WorkProgramGeneralFields.VIDEO_LINK]: this.props.video,
        [WorkProgramGeneralFields.QUALIFICATION]: this.props.qualification,
        [WorkProgramGeneralFields.LANGUAGE]: this.props.language,
        [WorkProgramGeneralFields.SEMESTER_COUNT]: this.props.semesterCount,
        [WorkProgramGeneralFields.BARS]: this.props.bars,
        [WorkProgramGeneralFields.IMPLEMENTATION_FORMAT]: this.props.implementationFormat,
      })
    }
  }

  saveField = (field: string) => (e: React.ChangeEvent) => {
    this.props.actions.saveWorkProgram({
      destination: field,
      value: get(e, 'target.value')
    });
  };

  changeCode = (e: React.ChangeEvent) => {
    this.setState({
      [WorkProgramGeneralFields.CODE]: get(e, 'target.value')
    });
  }

  changeTitle = (e: React.ChangeEvent) => {
    this.setState({
      [WorkProgramGeneralFields.TITLE]: get(e, 'target.value')
    });
  }

  changeAuthors = (e: React.ChangeEvent) => {
    this.setState({
      [WorkProgramGeneralFields.AUTHORS]: get(e, 'target.value')
    });
  }

  changeVideo = (e: React.ChangeEvent) => {
    this.setState({
      [WorkProgramGeneralFields.VIDEO_LINK]: get(e, 'target.value')
    });
  }

  changeSemesterCount = (e: React.ChangeEvent) => {
    const value = get(e, 'target.value')
    this.setState({
      [WorkProgramGeneralFields.SEMESTER_COUNT]: parseInt(value)
    });
    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.SEMESTER_COUNT,
      value: parseInt(value)
    });
  }

  changeDescription = (e: React.ChangeEvent) => {
    this.setState({
      [WorkProgramGeneralFields.DESCRIPTION]: get(e, 'target.value')
    });
  }

  changeLanguage = (language: string) => {
    this.setState({
      [WorkProgramGeneralFields.LANGUAGE]: language
    });

    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.LANGUAGE,
      value: language
    });
  }

  changeImplementationFormat = (implementationFormat: string) => {
    this.setState({
      [WorkProgramGeneralFields.IMPLEMENTATION_FORMAT]: implementationFormat
    });

    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.IMPLEMENTATION_FORMAT,
      value: implementationFormat
    });
  }

  changeStructuralUnit = (structuralUnit: string) => {
    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.STRUCTURAL_UNIT,
      value: structuralUnit
    });
  }

  changeDate = (date: Moment) => {
    this.setState({
      [WorkProgramGeneralFields.APPROVAL_DATE]: date.format()
    })

    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.APPROVAL_DATE,
      value: date.format()
    });
  }

  handleAddUser = (userId: number) => {
    const {editors} = this.props;

    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.EDITORS,
      value: [
        ...editors.map(user => user[UserFields.ID]),
        userId
      ]
    });

    this.setState({
      addEditorsMode: false
    });
  }

  deleteEditor = (userId: number) => () => {
    const {editors} = this.props;

    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.EDITORS,
      value: editors.reduce((editors: Array<any>, user) => {
        if (user[UserFields.ID] !== userId) {
          editors.push(user[UserFields.ID]);
        }
        return editors;
      }, [])
    });
  }

  handleChangeStructuralUnitSearchText = (searchText: string) => {
    this.props.structuralUnitActions.changeSearchQuery(searchText);
    this.props.structuralUnitActions.getStructuralUnits();
  }

  handleBars = (e: React.ChangeEvent) => {
    this.props.actions.saveWorkProgram({
      destination: WorkProgramGeneralFields.BARS,
      value: get(e, "target.checked", false)
    })
    this.setState({
      [WorkProgramGeneralFields.BARS]: get(e, "target.checked", false)
    });
  }

  render() {
    const {
      classes, fetchingTitle, fetchingCode, fetchingAuthors, fetchingDate, fetchingVideoLink, fetchingDescription,
      isCanEdit, editors, structuralUnit, structuralUnitsList, canAddEditors
    } = this.props;
    const {state} = this;
    const {addEditorsMode} = state;

    return (
      <div className={classes.container}>
        <div className={classNames(classes.side, {[classes.fullWidth]: !isCanEdit})}>
          <InputsLoader loading={fetchingCode}>
            {isCanEdit ?
              <TextField variant="outlined"
                         label="Идентификационный номер программы"
                         className={classes.input}
                         value={state[WorkProgramGeneralFields.CODE]}
                         onBlur={this.saveField(WorkProgramGeneralFields.CODE)}
                         onChange={this.changeCode}
                         disabled={fetchingCode || !isCanEdit}
                         InputLabelProps={{
                           shrink: true,
                         }}
              />
              :
              <Typography className={classes.textItem}> <b>Идентификационный номер
                программы:</b> {state[WorkProgramGeneralFields.CODE]}</Typography>
            }

          </InputsLoader>
          <InputsLoader loading={fetchingTitle}>
            {isCanEdit ?
              <TextField variant="outlined"
                         label="Название дисциплины"
                         value={state[WorkProgramGeneralFields.TITLE]}
                         className={classes.input}
                         onBlur={this.saveField(WorkProgramGeneralFields.TITLE)}
                         onChange={this.changeTitle}
                         disabled={fetchingTitle || !isCanEdit}
              />
              :
              <Typography className={classes.textItem}> <b>Название
                дисциплины:</b> {state[WorkProgramGeneralFields.TITLE]}</Typography>
            }
          </InputsLoader>
          <InputsLoader loading={fetchingAuthors}>
            {isCanEdit ?
              <TextField variant="outlined"
                         label="Авторский состав"
                         value={state[WorkProgramGeneralFields.AUTHORS]}
                         className={classes.input}
                         onBlur={this.saveField(WorkProgramGeneralFields.AUTHORS)}
                         onChange={this.changeAuthors}
                         disabled={fetchingAuthors || !isCanEdit}
                         InputLabelProps={{
                           shrink: true,
                         }}
              />
              :
              <Typography className={classes.textItem}> <b>Авторский
                состав:</b> {state[WorkProgramGeneralFields.AUTHORS]}</Typography>
            }
          </InputsLoader>

          {isCanEdit ?
            <SearchSelector label="Структурное подразделение"
                            changeSearchText={this.handleChangeStructuralUnitSearchText}
                            list={structuralUnitsList}
                            changeItem={this.changeStructuralUnit}
                            value={structuralUnit?.id}
                            valueLabel={structuralUnit?.title}
                            className={classes.marginBottom20}
            />
            :
            <Typography className={classes.textItem}>
              <b>Структурное подразделение:</b> {structuralUnit?.title || 'Подразделение не указано'}
            </Typography>
          }

          <InputsLoader loading={fetchingVideoLink}>
            {isCanEdit ?
              <TextField variant="outlined"
                         label="Видео"
                         value={state[WorkProgramGeneralFields.VIDEO_LINK]}
                         className={classes.input}
                         onBlur={this.saveField(WorkProgramGeneralFields.VIDEO_LINK)}
                         onChange={this.changeVideo}
                         disabled={fetchingVideoLink || !isCanEdit}
                         InputLabelProps={{
                           shrink: true,
                         }}
              />
              :
              <Typography className={classes.textItem}> <b>Видео: </b>< a
                href={WorkProgramGeneralFields.VIDEO_LINK}> Видео </a></Typography>
            }
          </InputsLoader>

          {!isCanEdit &&
          <Typography className={classes.textItem}><b>Уровень образовательной
            программы:</b> {specializationObject[state[WorkProgramGeneralFields.QUALIFICATION]]} </Typography>
          }

          {!isCanEdit &&
          <Typography className={classes.textItem}><b>Язык
            реализации:</b> {languageObject[state[WorkProgramGeneralFields.LANGUAGE]]} </Typography>
          }


          {!isCanEdit &&
          <>
            <Typography className={classes.textItem}> {state[WorkProgramGeneralFields.DESCRIPTION]} </Typography>
          </>
          }

          {/*<Typography className={classes.textItem}>*/}
          {/*    <b>Структурное подразделение:</b> {structuralUnit?.title || 'Подразделение не указано'}*/}
          {/*</Typography>*/}

          {isCanEdit ?
            <FormControl component="fieldset">
              <FormLabel component="legend">Кол-во семестров *</FormLabel>
              <RadioGroup className={classes.radioGroup} onChange={this.changeSemesterCount}>
                <FormControlLabel
                  value={1}
                  control={<Radio checked={state[WorkProgramGeneralFields.SEMESTER_COUNT] === 1} />}
                  label="1"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio checked={state[WorkProgramGeneralFields.SEMESTER_COUNT] === 2} />}
                  label="2"
                />
                <FormControlLabel
                  value={3}
                  control={<Radio checked={state[WorkProgramGeneralFields.SEMESTER_COUNT] === 3} />}
                  label="3"
                />
                <FormControlLabel
                  value={4}
                  control={<Radio checked={state[WorkProgramGeneralFields.SEMESTER_COUNT] === 4} />}
                  label="4"
                />
              </RadioGroup>
            </FormControl>
              :
              <Typography className={classes.textItem}> <b>Кол-во семестров: </b> {state[WorkProgramGeneralFields.SEMESTER_COUNT]}</Typography>
            }

          <div style={{display: "flex", alignItems: "center"}}>
            <Typography>Дисциплина реализуется в БАРС 2.0</Typography>
            <Switch
              checked={state[WorkProgramGeneralFields.BARS]}
              onChange={this.handleBars}
              disabled={!isCanEdit}
            />
          </div>

          <Typography className={classes.editorTitle}>
            Редакторы:
          </Typography>

          <div className={classes.editorsList}>
            {editors && editors.map && editors.map(editor =>
              <Chip label={getUserFullName(editor)}
                    onDelete={isCanEdit ? this.deleteEditor(editor[UserFields.ID]) : undefined}
                    className={classes.editorItem}
              />
            )}
          </div>

          {addEditorsMode ?
            <Dialog open
                    fullWidth
                    maxWidth="sm"
                    classes={{
                      paper: classes.dialog
                    }}
                    onClose={() => this.setState({addEditorsMode: false})}
            >
              <UserSelector handleChange={this.handleAddUser}
                            selectorLabel="Выберите редактора"
                            label="Выберите редактора"
                            noMargin
              />
            </Dialog>
            :
            canAddEditors
              ?
              <Button onClick={() => this.setState({addEditorsMode: true})}
                      variant="text"
                      className={classes.addEditorButton}
              >
                <AddIcon/> Добавить редактора
              </Button>
              :
              <></>
          }

        </div>

        {isCanEdit &&
        <div className={classes.side}>
          <InputsLoader loading={fetchingDescription}>
            <TextField variant="outlined"
                       label="Описание"
                       value={state[WorkProgramGeneralFields.DESCRIPTION]}
                       className={classes.input}
                       onBlur={this.saveField(WorkProgramGeneralFields.DESCRIPTION)}
                       onChange={this.changeDescription}
                       disabled={fetchingDescription || !isCanEdit}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       multiline
                       rows={11}
            />
          </InputsLoader>

          <SpecializationSelector/>

          <SimpleSelector label="Язык реализации"
                          metaList={languageArray}
                          value={state[WorkProgramGeneralFields.LANGUAGE]}
                          wrapClass={classes.selectorWrap}
                          onChange={this.changeLanguage}
          />

          {(state[WorkProgramGeneralFields.IMPLEMENTATION_FORMAT] || state[WorkProgramGeneralFields.IMPLEMENTATION_FORMAT] === null) && (
            <SimpleSelector
              label="Формат реализации"
              metaList={implementationFormats}
              value={state[WorkProgramGeneralFields.IMPLEMENTATION_FORMAT]}
              wrapClass={classes.selectorWrap}
              onChange={this.changeImplementationFormat}
              noMargin
            />
          )}
          <Typography className={classes.marginBottom20}>Обратите внимание, при выборе онлайн формата все ваши введенные часы будут обнулены</Typography>

          <InputsLoader loading={fetchingDate}>
            <DatePicker
              value={moment(state[WorkProgramGeneralFields.APPROVAL_DATE])}
              onChange={(date: any) => this.changeDate(date)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <DateIcon/>
                  </IconButton>
                ),
              }}
              inputVariant="outlined"
              className={classes.datePicker}
              format={FULL_DATE_FORMAT}
              label={'Дата создания'}
              disabled={!isCanEdit}
            />
          </InputsLoader>
        </div>
        }
      </div>
    );
  }
}

export default connect(withStyles(styles)(FirstStep));

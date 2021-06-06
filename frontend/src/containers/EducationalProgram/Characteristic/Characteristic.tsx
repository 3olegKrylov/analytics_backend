import React from 'react';
import {withRouter} from "react-router-dom";
import get from 'lodash/get';

import Paper from '@material-ui/core/Paper';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {CharacteristicProps,} from '../types';
import {steps} from './constants';

import connect from './Characteristic.connect';
import styles from './Characteristic.styles';
import CKEditor from "../../../components/CKEditor";
import UserSelector from "../../Profile/UserSelector";
import EducationPlanInDirectionSelector
    from "../../EduationPlanInDirection/EducationPlanInDirectionSelector/EducationPlanInDirectionSelector";
import {CompetenceTableType, EducationProgramCharacteristicFields, EducationProgramFields} from "../enum";
import {getUserFullName, YEAR_DATE_FORMAT} from "../../../common/utils";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import QualificationSelector from "../../../components/QualificationSelector/QualificationSelector";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {CompetenceType} from "../../Competences/types";
import {CompetenceFields} from "../../Competences/enum";
import {IndicatorType} from "../../Indicators/types";
import {IndicatorsFields} from "../../Indicators/enum";
import {UserFields} from "../../../layout/enum";
import {CompetenceTable} from "./CompetencesTable/CompetenceTable";
import {ProfessionalCompetences} from "./ProfessionalCompetences/ProfessionalCompetences";
import InputLabel from '@material-ui/core/InputLabel'

class Characteristic extends React.Component<CharacteristicProps> {
    state = {
        activeStep: 0
    };

    componentDidMount() {
        this.props.actions.getEducationalProgramCharacteristic(get(this.props, 'match.params.id'));
    }

    handleStep = (number: number) => () => {
        this.setState({activeStep: number})
    };

    handleChangeEducationProgramYear = (value: MaterialUiPickersDate) => {
        this.props.actions.changeEducationalProgram({
            id: this.getEducationalProgramId(),
            payload: {
                [EducationProgramFields.YEAR]: value ? value.format(YEAR_DATE_FORMAT) : ''
            }
        })
    }

    handleChangeQualification = (value: string) => {
        this.props.actions.changeEducationalProgram({
            id: this.getEducationalProgramId(),
            payload: {
                [EducationProgramFields.QUALIFICATION]: value
            }
        })
    }

    handleChangeSKEEditorField = (field: string) => (event: any) => {
        const data: string = event.editor.getData()
        this.props.actions.changeEducationalProgramCharacteristic({
            id: this.getEducationalProgramCharacteristicId(),
            educationalProgramId: this.getEducationalProgramId(),
            payload: {
                [field]: data
            }
        })
    }

    getEducationalProgramId = () => get(this.props.educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.ID], '');

    getEducationalProgramCharacteristicId = () => get(this.props.educationalProgramCharacteristic, EducationProgramCharacteristicFields.ID, '');

    returnCompetences = (competences: Array<CompetenceType>) => {
        const {classes} = this.props;
        return <>
            <Table stickyHeader size='small'>
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell>
                            №
                        </TableCell>
                        <TableCell>
                            Название
                        </TableCell>
                        <TableCell>
                            Индикаторы
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {competences.map((item: any, index: number) => {
                        const indicators = get(item, 'indicator_in_competencse', []);

                        if (indicators.length === 0) {
                            return <TableRow>
                                <TableCell>
                                    {item[CompetenceFields.NUMBER]}
                                </TableCell>
                                <TableCell>
                                    {item[CompetenceFields.TITLE]}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        }

                        return indicators.map((indicator: IndicatorType, index: number) =>
                            <TableRow>
                                {index === 0 &&
                                    <TableCell rowSpan={indicators.length}>
                                        {item[CompetenceFields.NUMBER]}
                                    </TableCell>
                                }
                                {index === 0 &&
                                    <TableCell rowSpan={indicators.length}>
                                        {item[CompetenceFields.TITLE]}
                                    </TableCell>
                                }
                                <TableCell>
                                    {indicator[IndicatorsFields.NUMBER]} {indicator[IndicatorsFields.TITLE]}
                                </TableCell>
                            </TableRow>
                        )

                    })}
                </TableBody>
            </Table>
            <div style={{display: 'flex'}}>
                <Button variant="outlined" style={{marginLeft: 'auto', marginTop: '20px'}}>Добавить</Button>
            </div>
        </>
    }

    returnProfessionalCompetences = (competences: Array<CompetenceType>) => {
        const {classes} = this.props;
        return <>
            <Table stickyHeader size='small'>
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell style={{width: '25%'}}>
                            Код и наименование компетенции
                        </TableCell>
                        <TableCell style={{width: '25%'}}>
                            Код и наименование индикатора
                        </TableCell>
                        <TableCell style={{width: '25%'}}>
                            Наименование сопряженного проф. стандарта
                        </TableCell>
                        <TableCell style={{width: '25%'}}>
                            Выбранные обобщенные трудовые функции
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {competences.map((item: any, index: number) =>
                        <TableRow>
                            <TableCell style={{width: '25%'}}>
                                {item.competence[CompetenceFields.NUMBER]} {item.competence[CompetenceFields.TITLE]}
                            </TableCell>
                            <TableCell style={{width: '25%'}}>
                                {get(item, 'competence.indicator_in_competencse', []).map((item: IndicatorType) =>
                                    <> {item[IndicatorsFields.NUMBER]} {item[IndicatorsFields.TITLE]}<br/></>
                                )}
                            </TableCell>
                            <TableCell style={{width: '25%'}}>
                                {get(item, 'professional_standard', []).map((standard: any) => <>{get(standard, 'code')} {get(standard, 'title')}<br/></>)}
                            </TableCell>
                            <TableCell style={{width: '25%'}}>
                                {item.labor_functions}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div style={{display: 'flex'}}>
                <Button variant="outlined" style={{marginLeft: 'auto', marginTop: '20px'}}>Добавить</Button>
            </div>
        </>
    }

    renderContent = () => {
        const {educationalProgramCharacteristic, classes} = this.props;
        const {activeStep} = this.state;

        switch (activeStep){
            case 0:
                return <>
                    <EducationPlanInDirectionSelector value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.ACADEMIC_PLAN_FOR_EP, 'id'], '')}
                                                      handleChange={() => {}} />
                    <UserSelector selectorLabel="Руководитель"
                                  value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.MANAGER, 'id'], '').toString()}
                                  label={getUserFullName(get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.MANAGER], ''))}
                    />
                    <DatePickerComponent label="Год *"
                                         views={["year"]}
                                         value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.YEAR], '').toString()}
                                         onChange={this.handleChangeEducationProgramYear}
                                         format={YEAR_DATE_FORMAT}
                    />
                    <QualificationSelector onChange={this.handleChangeQualification}
                                           value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EDUCATION_PROGRAM, EducationProgramFields.QUALIFICATION], '')}
                    />
                </>
            case 1:
                return <div className={classes.editorWrap}>
                            <InputLabel className={classes.label}>Аннотация</InputLabel>
                            <CKEditor 
                                value={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.ANNOTATION, '')}
                                onBlur={this.handleChangeSKEEditorField(EducationProgramCharacteristicFields.ANNOTATION)}
                                toolbarContainerId="toolbar-container"
                            />
                        </div>
            case 2:
                return <>
                    <Typography className={classes.label}>Область профессиональной деятельности</Typography>
                    <Table stickyHeader size='small'>
                        <TableHead className={classes.header}>
                            <TableRow>
                                <TableCell>
                                    №
                                </TableCell>
                                <TableCell>
                                    Код и наименования области профессиональной деятельности
                                </TableCell>
                                <TableCell>
                                    Код профессионального стандарта из данной области
                                </TableCell>
                                <TableCell>
                                    Наименование профессионального стандарта из данной области
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.AREA_OF_ACTIVITY, []).map((item: any, index: number) => {
                                const standards = get(item, 'professional_standard', []);

                                if (standards.length === 0) {
                                    return <TableRow>
                                        <TableCell>
                                            {index}
                                        </TableCell>
                                        <TableCell>
                                            {item.title}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                }

                                return standards.map((standard: any, standardIndex: number) =>
                                    <TableRow>
                                        {standardIndex === 0 &&
                                            <TableCell rowSpan={standards.length}>
                                                {index}
                                            </TableCell>
                                        }
                                        {standardIndex === 0 &&
                                            <TableCell rowSpan={standards.length}>
                                                {item.title}
                                            </TableCell>
                                        }

                                        <TableCell>
                                            {get(standard, 'code')}
                                        </TableCell>
                                        <TableCell>
                                            {get(standard, 'title')}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    <div style={{display: 'flex'}}>
                        <Button variant="outlined" style={{marginLeft: 'auto', marginTop: '20px'}}>Добавить</Button>
                    </div>
                    <br/> <br/>
                    <div className={classes.editorWrap}>
                        <InputLabel className={classes.label}>Сферы профессиональной деятельности</InputLabel>
                        <CKEditor 
                            value={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.KINDS_OF_ACTIVITIES, '')}
                            onBlur={this.handleChangeSKEEditorField(EducationProgramCharacteristicFields.KINDS_OF_ACTIVITIES)}
                            toolbarContainerId="toolbar-container2"
                        />
                    </div>
                </>
            case 3:
                return <>
                        <div className={classes.editorWrap}>
                            <InputLabel className={classes.label}>Объекты профессиональной деятельности</InputLabel>
                            <CKEditor 
                                value={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.OBJECTS_OF_ACTIVITY, '')}
                                onBlur={this.handleChangeSKEEditorField(EducationProgramCharacteristicFields.OBJECTS_OF_ACTIVITY)}
                                toolbarContainerId="toolbar-container1"
                            />
                        </div>
                        <div className={classes.editorWrap}>
                            <InputLabel className={classes.label}>Задачи профессиональной деятельности</InputLabel>
                            <CKEditor 
                                value={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.TASKS_OF_ACTIVITY, '')}
                                onBlur={this.handleChangeSKEEditorField(EducationProgramCharacteristicFields.TASKS_OF_ACTIVITY)}
                                toolbarContainerId="toolbar-container3"
                            />
                        </div>
                </>;

            case 4:
                return <CompetenceTable competenceTableType={CompetenceTableType.KEY_COMPETENCES}
                                        tableData={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.KEY_COMPETENCES, [])}
                />;
            case 5:
                return <CompetenceTable competenceTableType={CompetenceTableType.SUPRA_PROFESSIONAL_COMPETENCES}
                                        tableData={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.SUPRA_PROFESSIONAL_COMPETENCES, [])}
                />;
            case 6:
                return <CompetenceTable competenceTableType={CompetenceTableType.GENERAL_PROFESSIONAL_COMPETENCES}
                                        tableData={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.GENERAL_PROFESSIONAL_COMPETENCES, [])}
                />;

            case 7:
                return <ProfessionalCompetences tableData={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.PROFESSIONAL_COMPETENCES, [])} />;
            case 8:
                return <div className={classes.editorWrap}>
                        <InputLabel className={classes.label}>Необходимый преподавательский состав</InputLabel>
                        <CKEditor 
                            value={get(educationalProgramCharacteristic, EducationProgramCharacteristicFields.PPS, '')}
                            onBlur={this.handleChangeSKEEditorField(EducationProgramCharacteristicFields.PPS)}
                            toolbarContainerId="toolbar-container"
                        />
                </div>
            case 9:
                return <>
                    <UserSelector selectorLabel='Разработчики'
                                  value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DEVELOPERS, 0, UserFields.ID], '')}
                                  handleChange={()=>{}}
                                  label={getUserFullName(get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DEVELOPERS, 0, UserFields.ID], ''))}
                    />
                    <UserSelector selectorLabel="Представители работодателей"
                                  value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EMPLOYERS, 0, UserFields.ID], '')}
                                  handleChange={()=>{}}
                                  label={getUserFullName(get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.EMPLOYERS, 0, UserFields.ID], ''))}
                    />
                    <UserSelector selectorLabel="Директор мегафакультета"
                                  handleChange={()=>{}}
                                  value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DIRECTOR_MEGAFALCULTY, UserFields.ID], '')}
                                  label={getUserFullName(get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DIRECTOR_MEGAFALCULTY, UserFields.ID], ''))}
                    />
                    <UserSelector selectorLabel="Декан факультета"
                                  value={get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DEAN, UserFields.ID], '')}
                                  label={getUserFullName(get(educationalProgramCharacteristic, [EducationProgramCharacteristicFields.DEAN, UserFields.ID], ''))}
                                  handleChange={()=>{}}
                    />
                </>
        }
    }

    render() {
        const {classes} = this.props;
        const {activeStep} = this.state;

        return (
            <Paper className={classes.root}>
                <Stepper activeStep={activeStep}
                         orientation="vertical"
                         nonLinear
                         className={classes.stepper}
                >
                    {steps.map((value, index) => {
                        return (
                            <Step key={index}>
                                <StepButton onClick={this.handleStep(index)}
                                            completed={false}
                                            style={{textAlign: 'left'}}
                                >
                                    {value}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className={classes.content}>
                    <Typography className={classes.title}>
                        <div>Характеристика образовательной программы <span style={{fontWeight: 500}}>"Название"</span></div>
                    </Typography>

                    {this.renderContent()}
                </div>
            </Paper>
        );
    }
}

export default withRouter(connect(withStyles(styles)(Characteristic)));

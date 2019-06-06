import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NaoFormGroup, NaoFormArray, NaoFormControl } from '@naologic/forms';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  constructor() { }
  public parentForm: NaoFormGroup;
  public typeOptions = [
    { option: 'string', displayValue: 'String', defaultValue: () => '' },
    { option: 'number', displayValue: 'Number', defaultValue: () => 0 },
    { option: 'boolean', displayValue: 'Boolean', defaultValue: () => true },
    {
      option: 'object', displayValue: 'Map', defaultValue: () => {
        return { 'prop1': 'test' };
      }
    },
    { option: 'array', displayValue: 'Array', defaultValue: () => [''] },
    { option: 'generateUuid', displayValue: 'Uuid', defaultValue: () => Guid.create().toString() },
    { option: 'date', displayValue: 'Date', defaultValue: () => this.getDate()}
  ];
  @Input() mapObject: any;
  @Input() isRoot: boolean;

  @Input() isArray: boolean;
  @Input() parentFieldName: string;
  @ViewChildren(EditorComponent) private editorChildren: QueryList<EditorComponent>;

  ngOnInit() {
    const formArray = new NaoFormArray([]);
    // tslint:disable-next-line:forin
    if (this.mapObject) {
      // tslint:disable-next-line:forin
      for (const key in this.mapObject) {
        formArray.push(new NaoFormGroup({
          field: new NaoFormControl(key, Validators.required),
          type: new NaoFormControl(this.getTypeOfField(this.mapObject[key]), Validators.required),
          value: new NaoFormControl(this.mapObject[key], Validators.required)
        }));
      }
    }
    this.parentForm = new NaoFormGroup({ arrayOfFields: formArray });
  }

  optionChanged(event, control): void {
    for (const opt of this.typeOptions) {
      if (opt.option === event) {
        console.log(opt.defaultValue())
        control.setValue(opt.defaultValue());
      }
    }
  }
  getDate(): string {
      const today = new Date();
      let month;
      let day;
      if ( today.getMonth() < 10 ) {
        month = `0${today.getMonth() + 1}`;
      } else {
        month = today.getMonth();
      }
      if ( today.getDate() < 10 ) {
        day = `0${today.getDate()}`;
      } else {
        day = today.getDate()
      }
      return `${today.getFullYear()}-${month}-${day}`;
  }
  isPrimitiveType(value: string): boolean {
    if (value === 'object' || value === 'array') {
      return false;
    }
    return true;
  }

  getTypeOfField(val: any): string {
    if (Array.isArray(val)) {
      return 'array';
    }
    return typeof (val);
  }

  getChildEditorObjectValue(value: any, type: string): any {
    if (value) {
      return value;
    }
    for( const opt of this.typeOptions ) {
      if( opt.option === type ) {
        return opt.defaultValue();
      }
    }
  }

  deleteField(idx: number): void {
    const arrayOfFieldsCasted = this.parentForm.getAsNaoFormArray('arrayOfFields');
    arrayOfFieldsCasted.removeAt(idx);
  }

  addField(): void {
    let fieldName = 'prop1';
    const arrayOfFieldsCasted = this.parentForm.getAsNaoFormArray('arrayOfFields');
    if (this.isArray) {
      // @ts-ignore
      fieldName = arrayOfFieldsCasted.controls.length;
    }
    const newFieldGroup = new FormGroup({
      field: new FormControl(fieldName),
      type: new FormControl('string'),
      value: new FormControl('')
    });

    arrayOfFieldsCasted.push(newFieldGroup);
  }

  public getValue(): any {
    const result = this.isArray ? [] : {};
    const rawValue = this.parentForm.getRawValue();
    rawValue.arrayOfFields.forEach((group) => {
      if (this.isArray) {
        // @ts-ignore
        result.push(group.value);
      } else {
        result[group.field] = group.value;
      }
    });
    if (this.editorChildren) {
      this.editorChildren.forEach(child => {
        result[child.parentFieldName] = child.getValue();
      });
    }
    return result;
  }

  save(): void {
    const res = this.getValue();
    if (this.editorChildren) {
      this.editorChildren.forEach(child => {
        res[child.parentFieldName] = child.getValue();
      });
    }
    console.log(res);
  }

  isEditorFormValid(): boolean {
    let isFormValid = true;
    if (this.editorChildren) {
      this.editorChildren.forEach(child => {
        if (!child.isEditorFormValid()) {
          isFormValid = false;
        }
      });
    }

    if (this.parentForm && !this.parentForm.valid) {
      isFormValid = false;
    }
    return isFormValid;
  }
}

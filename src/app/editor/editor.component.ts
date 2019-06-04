import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  constructor() { }
  public parentForm: FormGroup;
  @Input() mapObject: any;
  @Input() isRoot: boolean;
  @Input() isArray: boolean;
  @Input() parentFieldName: string;
  @ViewChildren(EditorComponent) private editorChildren: QueryList<EditorComponent>;

  ngOnInit() {
    const formArray = new FormArray([]);
    // tslint:disable-next-line:forin
    if (this.mapObject) {
      // tslint:disable-next-line:forin
      for (const key in this.mapObject) {
        formArray.push(new FormGroup({
          field: new FormControl(key, Validators.required),
          type: new FormControl(this.getTypeOfField(this.mapObject[key]), Validators.required),
          value: new FormControl(this.mapObject[key], Validators.required)
        }));
      }
    }
    this.parentForm = new FormGroup({ arrayOfFields: formArray });
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

  getChildEditorObjectValue(value: any): any {
    if (typeof (value) === 'object') {
      return value;
    }
    return { prop1: 'test for object' };
  }

  getChildEditorArrayValue(value: any[]): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    return ['test for array'];
  }

  deleteField(idx: number): void {
    const arrayOfFieldsCasted = this.parentForm.controls.arrayOfFields as FormArray;
    arrayOfFieldsCasted.removeAt(idx);
  }

  addField(): void {
    let fieldName = 'prop1';
    const arrayOfFieldsCasted = this.parentForm.controls.arrayOfFields as FormArray;
    if (this.isArray) {
      //@ts-ignore
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
        //@ts-ignore
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
    if ( this.editorChildren ) {
      this.editorChildren.forEach( child => {
        if ( !child.isEditorFormValid()) {
          isFormValid = false;
        }
      });
    }

    if (this.parentForm &&  !this.parentForm.valid ) {
      isFormValid = false;
    }
    return isFormValid;
  }
}

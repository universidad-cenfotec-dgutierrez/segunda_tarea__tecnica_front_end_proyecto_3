import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ICategory} from "../../../interfaces";

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './category-form.component.html',
    styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {

    @Input() form!: FormGroup;
    @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();

    callSave() {

       /* if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }*/

        let item: ICategory = {
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value
        }
        if (this.form.controls['id'].value) {
            item.id = this.form.controls['id'].value;
        }
        if (item.id) {
            this.callUpdateMethod.emit(item);
        } else {
            this.callSaveMethod.emit(item);
        }
    }
}

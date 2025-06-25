import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ICategory, IProduct} from "../../../interfaces";

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

    @Input() form!: FormGroup;
    @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
    @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
    @Input({required: true}) categoriesList: ICategory[] = [];

    callSave() {
        let item: IProduct = {
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value,
            price: this.form.controls['price'].value,
            stock: this.form.controls['stock'].value,
            category: this.form.controls['category'].value as ICategory
        }

        const productId = this.form.controls['id'].value;

        if (productId &&
            productId !== '' &&
            productId !== -1) {
            item.id = productId;
        }

        if (item.id) {
            this.callUpdateMethod.emit(item);
        } else {
            this.callSaveMethod.emit(item);
        }
    }

  invalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}

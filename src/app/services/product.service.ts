import {inject, Injectable, signal} from '@angular/core';
import {BaseService} from "./base-service";
import {IProduct, ISearch} from "../interfaces";
import {AlertService} from "./alert.service";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService<IProduct> {

    protected override source: string = 'products';
    private productsListSignal = signal<IProduct[]>([]);

    get products$() {
        return this.productsListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 5
    };

    public totalItems: any = [];

    private alertService: AlertService = inject(AlertService);

    getAll() {
        this.findAllWithParams({page: this.search.page, size: this.search.size}).subscribe({
            next: (response) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
                this.productsListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('error', err);
            }
        });
    }

    save(item: IProduct) {
        this.add(item).subscribe({
            next: (response) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred adding the product', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    update(item: IProduct) {
        this.edit(item.id, item).subscribe({
            next: (response) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred updating the product', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    delete(item: IProduct) {
        this.del(item.id).subscribe({
            next: (response) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred deleting the product', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }
}

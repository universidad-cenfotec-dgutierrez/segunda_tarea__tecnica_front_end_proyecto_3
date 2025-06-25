import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ICategory, IProduct} from "../../interfaces";
import {ModalService} from "../../services/modal.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {ProductFormComponent} from "../../components/products/product-form/product-form.component";
import {ProductListComponent} from "../../components/products/product-list/product-list.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        ProductFormComponent,
        ProductListComponent,
        PaginationComponent,
        ModalComponent
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    public categoryService = inject(CategoryService);
    public productService = inject(ProductService);
    public fb = inject(FormBuilder);

    public productForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, Validators.required],
        stock: [0, Validators.required],
        category: this.fb.group({
            id: [-1, [Validators.required, Validators.min(1)]],
            name: [''],
            description: ['']
        })
    });


    public modalService = inject(ModalService);
    @ViewChild('editProductModal') public editCategoryModal: any;

    public authService: AuthService = inject(AuthService);
    public areActionsAvailable: boolean = false;
    public route: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.authService.getUserAuthorities();
        this.productService.getAll();
        this.categoryService.getAll();
        this.route.data.subscribe(data => {
            this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
        });
    }

    saveProduct(item: IProduct) {
        this.productService.save(item);
        this.productForm.reset();
    }

    updateProduct(item: IProduct) {
        this.productService.update(item);
        this.modalService.closeAll();
        this.productForm.reset();
    }

    deleteProduct(item: IProduct) {
        this.productService.delete(item);
    }

    openEditProductModal(item: IProduct) {
        this.productForm.patchValue({
            id: JSON.stringify(item.id),
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock,
            category: {
                id: item.category?.id ?? -1,
                name: item.category?.name ?? '',
                description: item.category?.description ?? ''
            }
        });
        this.modalService.displayModal('lg', this.editCategoryModal);
    }
}

import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ICategory} from "../../interfaces";
import {CategoryService} from "../../services/category.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CategoryFormComponent} from "../../components/category/category-form/category-form.component";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {CategoryListComponent} from "../../components/category/category-list/category-list.component";
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [
        CategoryFormComponent,
        PaginationComponent,
        CategoryListComponent,
        ModalComponent,
    ],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    public categoryService = inject(CategoryService);

   public  fb = inject(FormBuilder);

    public categoryForm = this.fb.group({
        id: [''],
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    public modalService = inject(ModalService);
    @ViewChild('editCategoryModal') public editCategoryModal: any;

    public authService: AuthService = inject(AuthService);
    public areActionsAvailable: boolean = false;
    public route: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.authService.getUserAuthorities();
        this.route.data.subscribe(data => {
            this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
        });
    }

    constructor() {
        this.categoryService.getAll();
    }

    saveCategory(item: ICategory) {
        this.categoryService.save(item);
        this.categoryForm.reset();
    }

    updateCategory(item: ICategory) {
        this.categoryService.update(item);
        this.modalService.closeAll();
        this.categoryForm.reset();
    }

    deleteCategory(item: ICategory) {
        this.categoryService.delete(item);
    }

    openEditCategoryModal(item: ICategory) {
        this.categoryForm.patchValue({
            id: JSON.stringify(item.id),
            name: item.name,
            description: item.description
        });
        this.modalService.displayModal('lg', this.editCategoryModal);
    }
}

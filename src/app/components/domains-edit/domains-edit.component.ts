import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Domain, DomainService } from '../../services/domain.service';

@Component({
    selector: 'app-domains-edit',
    templateUrl: './domains-edit.component.html',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ]
})
export class DomainsEditComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly domainService = inject(DomainService);
    private readonly router = inject(Router);

    editMode: boolean = false;
    domainId: number | null = null;

    domainForm = new FormGroup({
        hostname: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(255),
            Validators.pattern(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/)
        ])
    });

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ domain }) => {
            console.debug("Domain data: ", domain);
            this.editMode = domain != null;
            this.domainId = domain?.id || null;

            if (domain) {
                this.domainForm.patchValue({
                    hostname: domain.hostname
                });
            }

            if (this.editMode) {
                this.domainForm.markAllAsTouched();
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/', 'domains']);
    }

    save(): void {
        console.log("Save call!");

        this.domainForm.markAllAsTouched();

        if (this.domainForm.invalid) {
            console.log("Form is invalid");
            return;
        }

        const { hostname } = this.domainForm.value;
        if (!hostname) return;

        if (this.editMode && this.domainId) {
            this.domainService.update(this.domainId, { hostname })
                .subscribe({
                    next: (domain) => {
                        console.log("Domain updated:", domain);
                        this.router.navigate(['/', 'domains']);
                    },
                    error: (error) => {
                        console.error("Error updating domain:", error);
                    }
                });
        } else {
            this.domainService.create({ hostname })
                .subscribe({
                    next: (domain) => {
                        console.log("Domain created:", domain);
                        this.router.navigate(['/', 'domains']);
                    },
                    error: (error) => {
                        console.error("Error creating domain:", error);
                    }
                });
        }
    }

    getHostnameErrorMessage(): string {
        const control = this.domainForm.get('hostname');
        if (control?.hasError('required')) {
            return 'Hostname é obrigatório';
        }
        if (control?.hasError('minlength')) {
            return 'Mínimo 4 caracteres';
        }
        if (control?.hasError('maxlength')) {
            return 'Máximo 255 caracteres';
        }
        if (control?.hasError('pattern')) {
            return 'Hostname inválido. Exemplo: exemplo.com.br';
        }
        return '';
    }
}
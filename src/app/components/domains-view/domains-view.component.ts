import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Domain, DomainService, emptyFilter, DomainSearchFilter } from '../../services/domain.service';
import { ConfirmDisableDomainDialog } from '../confirm-disable-domain.dialog/confirm-disable-domain.dialog';
import { ConfirmEnableDomainDialog } from '../confirm-enable-domain.dialog/confirm-enable-domain.dialog';
import { RegenerateTokenDialog } from '../regenerate-token.dialog/regenerate-token.dialog';

@Component({
    selector: 'app-domains-view',
    imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: './domains-view.component.html'
})
export class DomainsViewComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly domainService = inject(DomainService);
    private readonly dialog = inject(MatDialog);

    domains: Domain[] = [];
    filter: DomainSearchFilter = emptyFilter();
    lastSearch: DomainSearchFilter = emptyFilter();

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ domains }) => {
            this.domains = domains;
        });
    }

    updateSearch() {
        this.domainService.search(this.filter)
            .subscribe(resp => this.domains = resp);
    }

    filterChanged() {
        const currentValue = this.filter.hostname;
        const lastValue = this.lastSearch.hostname;

        if (typeof currentValue === 'string' && typeof lastValue === 'string') {
            if (currentValue && lastValue && currentValue.includes(lastValue)) {
                this.domains = this.domains.filter(d =>
                    d.hostname.toLowerCase().includes(currentValue.toLowerCase())
                );
                this.lastSearch = { ...this.filter };
                return;
            }
        }
        this.updateSearch();
        this.lastSearch = { ...this.filter };
    }

    setStatusFilter(status: 'active' | 'inactive' | 'all'): void {
        switch (status) {
            case 'active':
                this.filter.disabled = false;
                break;
            case 'inactive':
                this.filter.disabled = true;
                break;
            case 'all':
                this.filter.disabled = null;
                break;
        }
        this.updateSearch();
    }

    clearFilters(): void {
        this.filter = emptyFilter();
        this.updateSearch();
    }

    confirmDisable(domain: Domain): void {
        const dialogData = {
            data: {
                id: domain.id,
                hostname: domain.hostname
            }
        };

        this.dialog
            .open(ConfirmDisableDomainDialog, dialogData)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.domainService.disable(domain.id).subscribe(updatedDomain => {
                        const index = this.domains.findIndex(d => d.id === domain.id);
                        if (index !== -1) {
                            this.domains[index] = updatedDomain;
                        }
                    });
                }
            });
    }

    confirmEnable(domain: Domain): void {
        const dialogData = {
            data: {
                id: domain.id,
                hostname: domain.hostname
            }
        };

        this.dialog
            .open(ConfirmEnableDomainDialog, dialogData)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.domainService.enable(domain.id).subscribe(updatedDomain => {
                        const index = this.domains.findIndex(d => d.id === domain.id);
                        if (index !== -1) {
                            this.domains[index] = updatedDomain;
                        }
                    });
                }
            });
    }

    regenerateToken(domain: Domain): void {
        const dialogData = {
            data: {
                id: domain.id,
                hostname: domain.hostname,
                currentToken: domain.token
            }
        };

        this.dialog
            .open(RegenerateTokenDialog, dialogData)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.domainService.regenerateToken(domain.id).subscribe(updatedDomain => {
                        const index = this.domains.findIndex(d => d.id === domain.id);
                        if (index !== -1) {
                            this.domains[index] = updatedDomain;
                        }
                    });
                }
            });
    }

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            // Poderia adicionar um toast/snackbar aqui
            console.log('Token copiado para a área de transferência');
        });
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    }

    maskToken(token: string): string {
        if (!token) return '';
        if (token.length <= 8) return token;
        return token.substring(0, 4) + '••••••••' + token.substring(token.length - 4);
    }

    getActiveCount(): number {
        return this.domains.filter(d => !d.disabled).length;
    }

    getInactiveCount(): number {
        return this.domains.filter(d => d.disabled).length;
    }
}
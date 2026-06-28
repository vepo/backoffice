import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Channel, EngageService } from '../../services/engage.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-channels-edit',
  templateUrl: './channels-edit.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ]
})
export class ChannelsEditComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly engageService = inject(EngageService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  editMode = false;
  channelId: number | null = null;
  apiKeyConfigured = false;
  saveError = '';
  receiveNotifications = false;
  followLoading = false;
  followError = '';

  channelForm = new FormGroup({
    youtubeId: new FormControl('', [
      Validators.required,
      Validators.minLength(24),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9_-]+$/)
    ]),
    youtubeApiKey: new FormControl(''),
    connected: new FormControl(false)
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.editMode = channel != null;
      this.channelId = channel?.id ?? null;
      this.apiKeyConfigured = channel?.apiKeyConfigured ?? false;

      if (channel) {
        this.channelForm.patchValue({
          youtubeId: channel.youtubeId,
          connected: channel.connected
        });
        this.loadFollowStatus(channel.id);
      }

      this.channelForm.get('connected')?.valueChanges.subscribe(() => this.updateApiKeyValidators());
      this.updateApiKeyValidators();
    });
  }

  cancel(): void {
    this.router.navigate(['/engage/channels']);
  }

  save(): void {
    this.saveError = '';
    this.channelForm.markAllAsTouched();
    this.updateApiKeyValidators();

    if (this.channelForm.invalid) {
      return;
    }

    const { youtubeId, youtubeApiKey, connected } = this.channelForm.getRawValue();
    if (!youtubeId) {
      return;
    }

    if (this.editMode && this.channelId) {
      const payload: { youtubeId: string; connected: boolean; youtubeApiKey?: string } = {
        youtubeId,
        connected: connected ?? false
      };
      if (youtubeApiKey?.trim()) {
        payload.youtubeApiKey = youtubeApiKey.trim();
      }

      this.engageService.updateChannel(this.channelId, payload).subscribe({
        next: () => this.router.navigate(['/engage/channels']),
        error: error => {
          this.saveError = error.error?.message ?? 'Não foi possível atualizar o canal.';
        }
      });
      return;
    }

    this.engageService.createChannel({
      youtubeId,
      youtubeApiKey: youtubeApiKey?.trim() || null,
      connected: connected ?? false
    }).subscribe({
      next: () => this.router.navigate(['/engage/channels']),
      error: error => {
        this.saveError = typeof error.error === 'string'
          ? error.error
          : error.error?.message ?? 'Não foi possível criar o canal.';
      }
    });
  }

  onReceiveNotificationsChange(checked: boolean): void {
    if (!this.editMode || !this.channelId || this.followLoading) {
      return;
    }

    this.followLoading = true;
    this.followError = '';
    const previous = this.receiveNotifications;
    this.receiveNotifications = checked;

    const request = checked
      ? this.notificationService.followChannel(this.channelId)
      : this.notificationService.unfollowChannel(this.channelId);

    request.subscribe({
      next: () => {
        this.followLoading = false;
      },
      error: () => {
        this.receiveNotifications = previous;
        this.followLoading = false;
        this.followError = 'Não foi possível atualizar o seguimento do canal.';
      }
    });
  }

  getYoutubeIdErrorMessage(): string {
    const control = this.channelForm.get('youtubeId');
    if (control?.hasError('required')) {
      return 'YouTube ID é obrigatório';
    }
    if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      return 'YouTube ID deve ter entre 24 e 50 caracteres';
    }
    if (control?.hasError('pattern')) {
      return 'YouTube ID contém caracteres inválidos';
    }
    return '';
  }

  getApiKeyErrorMessage(): string {
    const control = this.channelForm.get('youtubeApiKey');
    if (control?.hasError('required')) {
      return 'API key é obrigatória quando o canal está conectado';
    }
    if (control?.hasError('minlength')) {
      return 'API key deve ter pelo menos 20 caracteres';
    }
    return '';
  }

  private loadFollowStatus(engageChannelId: number): void {
    this.notificationService.getFollowStatus(engageChannelId).subscribe({
      next: status => {
        this.receiveNotifications = status.following;
      },
      error: () => {
        this.receiveNotifications = false;
      }
    });
  }

  private updateApiKeyValidators(): void {
    const connected = this.channelForm.get('connected')?.value ?? false;
    const apiKeyControl = this.channelForm.get('youtubeApiKey');
    if (!apiKeyControl) {
      return;
    }

    if (connected && (!this.editMode || !this.apiKeyConfigured)) {
      apiKeyControl.setValidators([Validators.required, Validators.minLength(20), Validators.maxLength(255)]);
    } else if (connected && this.editMode && this.apiKeyConfigured) {
      apiKeyControl.setValidators([Validators.minLength(20), Validators.maxLength(255)]);
    } else {
      apiKeyControl.setValidators([Validators.minLength(20), Validators.maxLength(255)]);
    }
    apiKeyControl.updateValueAndValidity({ emitEvent: false });
  }
}

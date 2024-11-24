import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isLoading = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  showAlert(message: string, header?, buttonArray?) {
    this.alertCtrl
      .create({
        header: header ? header : 'Authentication failed',
        message: message,
        buttons: buttonArray ? buttonArray : ['OK'],
      })
      .then((alertEl) => alertEl.present());
  }

  async showToast(msg, position, color, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position,
    });
    toast.present();
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(
      msg ? msg : 'No internect connection',
      'bottom',
      'danger',
      duration
    );
  }
  successToast(msg?) {
    this.showToast(msg, 'bottom', 'success');
  }

  setLoader() {
    this.isLoading = !this.isLoading;
  }
  showLoader(msg?, spinner?) {
    if (!this.isLoading) this.setLoader();

    return this.loadingCtrl
      .create({
        message: msg,
        spinner: spinner ? spinner : 'bubbles',
      })
      .then((res) => {
        res
          .present()
          .then(() => {
            if (!this.isLoading) {
              res.dismiss();
            }
          })
          .catch((err) => console.log(err));
      });
  }

  hideLoader() {
    if (this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss().catch((err) => console.log(err));
  }

  async createModal(options) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data) return data;
  }

  modalDismiss(val?) {
    let data: any = val ? val : null;
    this.modalCtrl.dismiss(data);
  }

  getIcon(title: string) {
    const name = title.toLowerCase();
    switch (name) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      default:
        return 'location-outline';
    }
  }
}

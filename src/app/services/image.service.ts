import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {environment} from '../models/environements';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {Platform} from '@ionic/angular';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    myPictures: any[] = [];
    imgUploaded: boolean = false;
    numImgUpload: number = 0;

    constructor(private http: HttpClient, private transfer: FileTransfer, public platform: Platform) {

    }

    uploadImages(uploadForm: FormGroup) {
        const headers = {
            enctype: 'multipart/form-data;',
            Accept: 'plain/text',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token'
        };
        const formData = new FormData();
        const url = `${environment.api_url}/upload`;

        for (const file of uploadForm.value.image) {
            formData.append('file', file);
        }
        let desc: string;

        return this.http.post<any>(url, formData, {headers});
    }

    uploadImage(uploadForm: FormGroup) {
        const headers = {
            enctype: 'multipart/form-data;',
            Accept: 'plain/text',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token'
        };
        const formData = new FormData();
        const url = `${environment.api_url}/uploadImgProfil`;
        formData.set('file', uploadForm.value.image);
        return this.http.post<any>(url, formData, {headers});
    }

    async loadImages() {
        const url = `${environment.api_url}/files`;
        return this.http.get(url);
    }

    deleteImage(filename) {
        const url = `${environment.api_url}/files/${filename}`;
        return this.http.delete(url);
    }

    async uploadMobileImage(images): Promise<any[]> {
        let data = [];
        const headers = {
            enctype: 'multipart/form-data;',
            Accept: 'plain/text',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token'
        };
        // on parcours le tableua d'images qui est passé en parametre
        for (let i = 0; i < images.length; i++) {
            const element: string = images[i];
            // on stocke le nom de l'image dans la variable 'elementName'
            let elementName: string = element.substr(element.lastIndexOf('/') + 1);
            console.log('elementName', elementName);
            // on initialise l'objet 'fileTransfer'
            let fileTransfer: FileTransferObject = this.transfer.create();
            const url: string = `${environment.api_url}/upload`;
            console.log('url', url);
            // on détermine les options d'upload de fichiers
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: elementName + '.jpg',
                chunkedMode: false,
                mimeType: 'image/jpeg',
                headers: headers,
                params: {'fileName': elementName, func: 'upload'}
            };
            if (!this.imgUploaded) {
                // on upload l'image et on stocke le résultat dans 'data'.
                let img = await fileTransfer.upload(element, url, options);
                const rep = JSON.parse(img.response);
                data.push(rep.filename);
                // on récupère l'id de l'image qui vient d'etre uploadé
                // let id: string = JSON.parse(data.response)._id;
                // // on incrémente le numbre d'images uploadées de 1
                // this.numImgUpload += 1;
            }

            // if (this.numImgUpload === images.length) {
            //     // si le nombre d'images uploadées = à la longeur du tablear alors :
            //     this.imgUploaded = true;
            // }
        }
        return data;
    }

}

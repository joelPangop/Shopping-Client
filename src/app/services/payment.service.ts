import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';
import {Observable} from 'rxjs';
import {Utilisateur} from '../models/utilisateur-interface';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) {
    }

    public createPayment(method, user: Utilisateur) {
        return this.http.post(`${environment.api_url1}/create-customer`, {card_details: method, email: user.email, customer: user.customer_profile});
    }

    retryInvoiceWithNewPaymentMethod(customer, paymentMethodId, invoiceId): Observable<any> {
        let body: string = JSON.stringify({
            customerId: customer.id,
            paymentMethodId: paymentMethodId,
            invoiceId: invoiceId,
        });
        return this.http.post(`${environment.api_url1}/retry-invoice`, body);
    }
}

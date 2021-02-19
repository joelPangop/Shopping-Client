import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';
import {Observable} from 'rxjs';
import {Utilisateur} from '../models/utilisateur-interface';
import {Commande} from '../models/commande-interface';
import {Article} from '../models/article-interface';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    stripe_key = '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';
    stripe_key_test: any = 'sk_test_uDpsb45Q2RafPC94m1LKGYt800b1sJ6Aa5';

    constructor(private http: HttpClient) {
    }

    public createPayment(method, user: Utilisateur) {
        return this.http.post(`${environment.api_url}/create-customer`, {
            card_details: method,
            email: user.email,
            customer: user.customer_profile
        });
    }

    retryInvoiceWithNewPaymentMethod(customer, paymentMethodId, invoiceId): Observable<any> {
        let body: string = JSON.stringify({
            customerId: customer.id,
            paymentMethodId: paymentMethodId,
            invoiceId: invoiceId,
        });
        return this.http.post(`${environment.api_url}/retry-invoice`, body);
    }

    createPlan(priceId: string, customer: Utilisateur, option: string, cardDetails: any, address_detail: any, bankDetails: any, personal_infos: any): Observable<any> {
        console.log('plan', {priceId: priceId, customer: customer, option: option});
        if (option === 'Individuel') {
            return this.http.post<any>(`${environment.api_url}/stripe/plan`, {
                priceId: priceId,
                customer: customer,
                option: option,
                cardDetails: cardDetails,
                personal_infos: personal_infos,
                bankDetails: bankDetails
            });

        } else {
            return this.http.post<any>(`${environment.api_url}/stripe/plan`, {
                priceId: priceId,
                customer: customer,
                option: option,
                cardDetails: cardDetails,
                bankDetails: bankDetails,
                address_detail: address_detail,
                personal_infos: personal_infos
            });
        }
    }

    cancelSubscription(id: string, time: string, email: string): Observable<any> {
        return this.http.delete<any>(`${environment.api_url}/stripe/subscription/${id}/${time}/${email}`);
    }

    cancelPaypalSubscription(id: string, userId: string): Observable<any> {
        return this.http.get<any>(`${environment.api_url}/paypal/cancel/subscription/${id}/${userId}`)
    }

    createBank(user_info: any, user: Utilisateur, email: string) {
        return this.http.post<any>(`${environment.api_url}/stripe/bank/token`, {
            user_info: user_info,
            user_customer: user.customer_profile,
            payment_account: user.payment_account,
            email: email
        });
    }

    deleteBank(bankId: string, user: Utilisateur) {
        return this.http.delete<any>(`${environment.api_url}/stripe/bank/token/${bankId}/${user.customer_profile.id}/${user.email}`);
    }

    createOrder(commande: any, addrDetails: any) {
        return this.http.post<Commande>(`${environment.api_url}/stripe/create-order`, {
            commande,
            addrDetails
        });
    }

    checkout(cardDetails: any, addrDetails: any, commande: any) {
        return this.http.post<any>(`${environment.api_url}/stripe/checkout`, {
            cardDetails: cardDetails,
            addrDetails: addrDetails,
            commande: commande
        });
    }

    subscribeWithPaypal(plan: string, user: Utilisateur): Observable<any> {
        const user_str: string = JSON.stringify(user);
        return this.http.get<any>(`${environment.api_url}/paypal/subscription/` + plan + `?user=` + user_str);
    }

    executeBillingPayment(paypalSubscriptionInfo: any, user: Utilisateur): Observable<any> {
        return this.http.put<any>(`${environment.api_url}/paypal/subscription/payment/` + paypalSubscriptionInfo, user);
    }

    payWitPaypal(addressDetails: any, command: Commande, amount_infos: any) : Observable<any> {
        const addrDetails = JSON.stringify(addressDetails);
        const commande = JSON.stringify(command);
        const amountInfos = JSON.stringify(amount_infos);
        return this.http.post<any>(`${environment.api_url}/paypal/payment/order?addrDetails=`+ addrDetails + `&amountInfos=`+ amountInfos, command);
    }

    executePaypalPayment(paymentInfos: any, userId: string): Observable<any> {
        return this.http.put<any>(`${environment.api_url}/paypal/execute/payment/${userId}`, paymentInfos);
    }
}

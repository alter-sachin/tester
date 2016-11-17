require 'offsite_payments/action_view_helper'

module Spree
  CheckoutController.class_eval do

    skip_before_filter :verify_authenticity_token, only: [:process_payment, :cancel_payment]
    skip_before_filter :set_state_if_present, only: [:process_payment, :cancel_payment]
    skip_before_filter :ensure_valid_state, only: [:process_payment, :cancel_payment]
    before_filter :confirm_payu, :only => [:update]
    layout proc { false if request.xhr? }

    ActionView::Base.send(:include, OffsitePayments::ActionViewHelper)

    def process_payment
      integration_module = OffsitePayments::integration('payu_in')
      notification_class = integration_module.const_get('Notification')
      notification = notification_class.new(params.to_query, options = {:credential1 => Rails.application.secrets.payu_key, :credential2 => Rails.application.secrets.payu_secret})
      payu_transaction = Spree::PayuTransaction.new(notification.params.slice("mihpayid" , "mode" , "order_id", "status" , "email" , "phone" , "name_on_card" , "bankcode" , "net_amount_debit" , "amount" , "discount" , "error" , "error_Message" , "PG_TYPE" , "bank_ref_num" , "cardCategory" , "card_type", "addedon"))
      if notification.acknowledge and notification.complete?
        payment = @order.payments.find_by_number(notification.invoice)
        if payment.present?
          payment.complete!
          # To recalculate order's payment_total and payment_state
          # Alternative could be @order.next or calling the update method.
          payment.response_code = notification.transaction_id
          payment.source = payu_transaction
          payment.save!
          @order = Spree::Order.find(@order)
        end

        @order.update_attributes(:state => "complete", :completed_at => Time.now)

        if @order.completed?
          @order.finalize!
          @current_order = nil
          flash.notice = Spree.t(:order_processed_successfully)
          flash['order_completed'] = true
          redirect_to completion_route
        else
          flash[:error] = @order.errors.full_messages.join("\n")
          redirect_to checkout_state_path(@order.state)
        end
      else
        flash[:error] = notification.message
        redirect_to checkout_state_path(@order.state)
      end
    end

    def cancel_payment
      flash[:error] = Spree.t(:payment_has_been_cancelled)
      redirect_to edit_order_path(@order)
    end

    private
    def confirm_payu
      return unless (params[:state] == "payment") && params[:order] && params[:order][:payments_attributes]

      payment_method = PaymentMethod.find(params[:order][:payments_attributes].first[:payment_method_id])
      if payment_method.kind_of?(BillingIntegration::Payu)
        # skrill_transaction = SkrillTransaction.new
        @payment = @order.payments.create(:amount => @order.total,
                                         :source => nil,
                                         :payment_method => payment_method)
        @payment.started_processing!
        #TODO confirming payment method
        # redirect_to edit_order_checkout_url(@order, :state => 'payment'), :notice => Spree.t(:complete_payu_checkout)
        render "spree/checkout/confirm_payu", layout: false
      end
    end
  end
end

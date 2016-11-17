# app/models/spree/billing_integration/payu.rb
module Payu
  class Spree::BillingIntegration::Payu < Spree::BillingIntegration  
    preference :key, :string
    preference :salt, :string

    def provider_class
      OffsitePayments::Integrations::PayuIn
    end

    def cancel(response)
      ActiveMerchant::Billing::Response.new(true, "", {}, {})
    end
  end
end

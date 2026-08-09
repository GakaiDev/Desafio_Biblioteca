class Bibliotecario < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  def send_devise_notification(notification, *args)
    devise_mailer.send(notification, self, *args).deliver_now
  end
end

Feature: Create a new user

  Scenario: Create a new user
    Given an "<email>" and "<password>"
    When there is no existing account with a matching email address
    Then create a new user account using the provided email address and password
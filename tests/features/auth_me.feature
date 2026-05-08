Feature: /auth/me endpoint

  Scenario: Create a new user
    Given an "<email>" and "<password>"
    When a user account is created
    Then return the UserAccount
# Slack GitHub Action [![CD](https://github.com/andrewscwei/slack-action/workflows/CD/badge.svg)](https://github.com/andrewscwei/slack-action/actions/workflows/cd.yml)

A GitHub Action for sending build status alerts to a Slack channel.

## Usage

```yml
uses: andrewscwei/slack-action@v1.0.0
with:
  success: ${{ needs.build.result == 'success' }}
  webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Inputs

### `success-prefix`

The prefix to use in a success alert, defaults to 😎.

### `failure-prefix`

The prefix to use in a failure alert, defaults to 😱.

### `webhook-url`

**Required**: The incoming webhook URL.

### `success`

**Required**: Specifies whether this is a success or failure alert.

### `cancelled`

Specifies whether this is a cancelled alert.

### `action-label`

Label of the action button. If provided along with `action-url`, the action button will be visible if `success` is `true`.

### `action-url`

Link of the action button. If provided along with `action-label`, the action button will be visible if `success` is `true`.

### `verbose`

Posts a more detailed version of the alert if enabled (defaults to `true`).

## Outputs

### `response`

The response of the Slack API request.

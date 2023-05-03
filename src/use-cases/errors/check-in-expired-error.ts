export class CheckInExpiredError extends Error {
  constructor() {
    super('Check-in expired.')
    this.name = 'CheckInExpiredError'
  }
}

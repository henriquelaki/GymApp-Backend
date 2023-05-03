import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface UserCoordinates {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseRequest {
  userCoordinates: UserCoordinates
  page: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userCoordinates,
    page,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby(
      {
        latitude: userCoordinates.userLatitude,
        longitude: userCoordinates.userLongitude,
      },
      page,
    )

    return { gyms }
  }
}

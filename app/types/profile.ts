// Define interfaces for each data source type
export interface GithubData {
    username: string;
    commits: number;
    stars: number;
}

export interface LinkedinData {
    bio: string;
}

export interface YoutubeData {
    channelsFollowed: string;
}

export interface SpotifyData {
    topArtists: string;
}

export interface PodcastData {
    favoritePodcasts: string;
}

export interface LocationData {
    city: string;
}

// Union type for all possible data types
export type SourceData = GithubData | LinkedinData | YoutubeData | SpotifyData | PodcastData | LocationData;

// Interface for the status of each data source
export interface DataSourceStatus {
    imported: boolean;
    data: SourceData | null;
}

// Type for the entire data source status object
export interface DataSourceStatuses {
    Github: DataSourceStatus;
    Linkedin: DataSourceStatus;
    Spotify: DataSourceStatus;
    Youtube: DataSourceStatus;
    Podcasts: DataSourceStatus;
    Location: DataSourceStatus;
}

export interface ProfileData {
    username?: string;
    handle?: string;
    avatar?: string;
    bio?: string;
    sources: DataSourceStatuses;
} 
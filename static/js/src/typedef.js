/**
 * @typedef {{
 *  errors: [{
 *    message: string,
 *    code: number
 *  }]
 * }} TwitterError
 */

/**
 * @typedef {{
 *   display_url: string,
 *   expanded_url: string,
 *   indices: Array,
 *   url: string
 * }} TweetUrls
 */

/**
 * @typedef {{
 *   display_url: string,
 *   expanded_url: string,
 *   id: number,
 *   id_str: string,
 *   indices: Array,
 *   media_url: string,
 *   media_url_https: string,
 *   sizes: Object,
 *   source_status_id: number,
 *   source_status_id_str: string,
 *   source_user_id: number,
 *   source_user_id_str: string,
 *   type: string,
 *   url: string
 * }} TweetMedia
 */

/**
 * @typedef {{
 *   hashtags: Array,
 *   symbols: Array,
 *   urls: Array<TweetUrls>,
 *   user_mentions: Array,
 *   media: Array<TweetMedia>
 * }} TweetEntity
 */

/**
 * @typedef {{
 *   contributors_enabled: boolean,
 *   created_at: string,
 *   default_profile: boolean,
 *   default_profile_image: boolean,
 *   description: string,
 *   entities: TweetEntity,
 *   favourites_count: number,
 *   follow_request_sent: boolean,
 *   followers_count: number,
 *   following: boolean
 *   friends_count: number,
 *   geo_enabled: boolean,
 *   id: number,
 *   id_str: string,
 *   is_translation_enabled: boolean,
 *   is_translator: boolean,
 *   lang: string,
 *   listed_count: number,
 *   location: string,
 *   name: string,
 *   notifications: boolean,
 *   profile_background_color: string,
 *   profile_background_image_url: string,
 *   profile_background_image_url_https: string,
 *   profile_background_tile: boolean,
 *   profile_banner_url: string,
 *   profile_image_url: string,
 *   profile_image_url_https: string,
 *   profile_link_color: string,
 *   profile_sidebar_border_color: string,
 *   profile_sidebar_fill_color: string,
 *   profile_text_color: string,
 *   profile_use_background_image: boolean,
 *   protected: boolean,
 *   screen_name: string,
 *   statuses_count: number,
 *   time_zone: string,
 *   url: string,
 *   utc_offset: number,
 *   verified: boolean
 * }} TwitterUser
 */

/**
 * @typedef {{
 *   created_at: string,
 *   entities: TweetEntity,
 *   favorite_count: number,
 *   favorited: boolean,
 *   id: number,
 *   id_str: string,
 *   lang: string,
 *   possibly_sensitive: boolean,
 *   retweet_count: number,
 *   retweeted: boolean,
 *   source: string,
 *   text: string,
 *   truncated: boolean,
 *   user: TwitterUser
 *   contributors_enabled: boolean,
 *   created_at: string,
 *   default_profile: boolean,
 *   default_profile_image: boolean,
 *   description: string,
 *   entities: TweetEntity,
 *   favourites_count: number,
 *   follow_request_sent: boolean,
 *   followers_count: number,
 *   following: boolean,
 *   friends_count: number,
 *   geo_enabled: boolean,
 *   id: number,
 *   id_str: string,
 *   is_translation_enabled: boolean,
 *   is_translator: boolean,
 *   lang: string,
 *   listed_count: number,
 *   location: string,
 *   name: string,
 *   notifications: boolean,
 *   profile_background_color: string,
 *   profile_background_image_url: string,
 *   profile_background_image_url_https: string,
 *   profile_background_tile: boolean,
 *   profile_banner_url: string,
 *   profile_image_url: string,
 *   profile_image_url_https: string,
 *   profile_link_color: string,
 *   profile_sidebar_border_color: string,
 *   profile_sidebar_fill_color: string,
 *   profile_text_color: string,
 *   profile_use_background_image: boolean,
 *   protected: boolean,
 *   screen_name: string,
 *   statuses_count: number,
 *   time_zone: string,
 *   url: string,
 *   utc_offset: number,
 *   verified: boolean
 * }} TweetData
 */

/**
 * @typedef {{
 *   created_at: string,
 *   entities: TweetEntity,
 *   extended_entities: TweetEntity,
 *   favorite_count: number,
 *   favorited: boolean,
 *   id: number,
 *   id_str: string,
 *   lang: string,
 *   possibly_sensitive: boolean,
 *   retweet_count: number,
 *   retweeted: boolean,
 *   retweeted_status: TweetData,
 *   source: string,
 *   text: string,
 *   truncated: boolean,
 *   user: TwitterUser
 * }} ReTweetData
 */

/**
 * @typedef {{
 *   id: string,
 *   username: string,
 *   url: string,
 *   timestamp: string,
 *   screenName: string,
 *   text: string,
 *   userImage: string,
 *   profileColor: string,
 *   entities: TweetEntity
 * }} SimpleTweet
 */

export default {
  getTweetWithUrls() {
    return {
      'id': '676884432339341312',
      'username': 'Alex Logashov',
      'url': 'https://twitter.com/logashoff/statuses/676884432339341312',
      'timestamp': 'Tue Dec 15 21:59:59 +0000 2015',
      'screenName': 'logashoff',
      'text': 'ANGULAR 2 TEMPLATE SYNTAX: https://t.co/gyYBNWXqvc',
      'userImage': '/images/twitter/logashoff.jpg',
      'profileColor': '#1F98C7',
      'entities': {
        'hashtags': [],
        'symbols': [],
        'user_mentions': [],
        'urls': [
          {
            'url': 'https://t.co/gyYBNWXqvc',
            'expanded_url': 'http://victorsavkin.com/post/119943127151/angular-2-template-syntax',
            'display_url': 'victorsavkin.com/post/119943127…',
            'indices': [
              27,
              50
            ]
          }
        ]
      },
      'protected': true
    };
  },
  getTweetWithUserMentions() {
    return {
      'id': '676851879792369664',
      'username': 'TypeScript',
      'url': 'https://twitter.com/typescriptlang/statuses/676851879792369664',
      'timestamp': 'Tue Dec 15 19:50:38 +0000 2015',
      'screenName': 'typescriptlang',
      'text': 'Congratulations to the @angularjs team on reaching their next milestone! ' +
        'Angular 2 Beta now available https://t.co/7a8tUwUMzd',
      'userImage': '/images/twitter/typescriptlang.jpg',
      'profileColor': '#0084B4',
      'entities': {
        'hashtags': [],
        'symbols': [],
        'user_mentions': [
          {
            'screen_name': 'angularjs',
            'name': 'Angular',
            'id': 202230373,
            'id_str': '202230373',
            'indices': [
              23,
              33
            ]
          }
        ],
        'urls': [
          {
            'url': 'https://t.co/7a8tUwUMzd',
            'expanded_url': 'http://angularjs.blogspot.com/2015/12/angular-2-beta.html?m=1',
            'display_url': 'angularjs.blogspot.com/2015/12/angula…',
            'indices': [
              102,
              125
            ]
          }
        ]
      },
      'protected': false
    }
  },
  getTweetWithHashtags() {
    return {
      'id': '596799758347456513',
      'username': 'JavaScript Live',
      'url': 'https://twitter.com/JavaScriptDaily/statuses/596799758347456513',
      'timestamp': 'Fri May 08 22:12:05 +0000 2015',
      'screenName': 'JavaScriptDaily',
      'text': 'Building Large Scale Web Applications with TypeScript: ' +
        'http://t.co/ItSp8rympT #video',
      'userImage': '/images/twitter/JavaScriptDaily.jpg',
      'profileColor': '#177A6E',
      'entities': {
        'hashtags': [
          {
            'text': 'video',
            'indices': [
              78,
              84
            ]
          }
        ],
        'symbols': [],
        'user_mentions': [],
        'urls': [
          {
            'url': 'http://t.co/ItSp8rympT',
            'expanded_url':
              'http://jj09.net/building-large-scale-web-applications-with-typescript/',
            'display_url': 'jj09.net/building-large…',
            'indices': [
              55,
              77
            ]
          }
        ]
      },
      'protected': false
    }
  }
}

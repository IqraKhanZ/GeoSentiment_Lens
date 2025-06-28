# GeoSentiment Lens - Interactive Sentiment Analysis Web App

## 🎯 App Purpose & Problem Solved

**GeoSentiment Lens** solves the challenge of understanding public sentiment and emotions around major events by providing real-time, geographically-mapped sentiment analysis. 

### What Problem It Solves:
- **Information Overload**: Helps make sense of massive amounts of social media and news data
- **Geographic Context**: Shows WHERE sentiment is happening, not just what people are saying
- **Real-time Insights**: Provides live updates on public opinion during events
- **Trend Analysis**: Identifies patterns and changes in sentiment over time
- **Decision Making**: Helps businesses, researchers, and organizations understand public opinion

## 🚀 How Each Feature Works

### 1. **Data Input System**
- **Upload Mode**: Drag & drop CSV files with text, location, timestamp data
- **Live API Mode**: Connect to real-time data sources (Twitter, Reddit, NewsAPI, etc.)
- **Auto-processing**: Automatically analyzes sentiment, emotions, and extracts keywords

### 2. **Geographic Visualization**
- **Interactive Map**: Uses Leaflet for real-world mapping
- **Color-coded Markers**: Green (positive), Red (negative), Gray (neutral)
- **Clustering**: Groups nearby data points for better visualization
- **Detailed Popups**: Shows sentiment breakdown and post counts per location

### 3. **Timeline Analysis**
- **Sentiment Trends**: Line charts showing sentiment changes over time
- **Emotion Tracking**: Multi-line charts for joy, anger, fear, sadness, surprise
- **Interactive Points**: Click to filter data by specific dates
- **Pattern Recognition**: Identifies sentiment spikes and trends

### 4. **Smart Dashboard**
- **Key Metrics**: Total posts, confidence scores, regional breakdowns
- **AI Insights**: Auto-generated summaries like "Mumbai had 25% rise in fear during cricket finals"
- **Region Comparison**: Side-by-side analysis of different locations
- **Sentiment Game**: Interactive quiz to test sentiment prediction skills

### 5. **Keyword Explorer**
- **Word Cloud**: Visual representation of trending terms
- **Hashtag Analysis**: Tracks popular hashtags and their sentiment
- **Clickable Filtering**: Click keywords to filter map and data
- **Sentiment Association**: Shows which keywords correlate with positive/negative sentiment

## 🔄 User Experience & Workflow

### Typical User Journey:

1. **Start**: User opens the app and sees sample data on the map
2. **Upload Data**: User uploads their own CSV file or connects to live APIs
3. **Explore Map**: User explores geographic sentiment patterns
4. **Filter & Analyze**: User applies filters (date, sentiment, keywords) to focus on specific insights
5. **Timeline View**: User switches to timeline to see how sentiment changed over time
6. **Dashboard Insights**: User reviews AI-generated insights and comparisons
7. **Keyword Analysis**: User explores trending terms and their sentiment associations
8. **Export Results**: User exports findings for reports or further analysis

### Key User Benefits:
- **No Technical Skills Required**: Simple drag-and-drop interface
- **Real-time Updates**: Live data feeds for current events
- **Multiple Perspectives**: Map, timeline, dashboard, and keyword views
- **Actionable Insights**: AI-generated summaries and recommendations
- **Export Capabilities**: Save data and insights for external use

## 🔧 Backend Setup Requirements

### For Complete Functionality, You Need:

#### 1. **Supabase Database** (Required for Live Data)
- **Purpose**: Stores API endpoints, live data, and user configurations
- **Setup**: Click "Connect to Supabase" button in the app
- **Auto-Configuration**: Database tables are created automatically
- **Tables Created**:
  - `api_endpoints`: Stores API connection details
  - `live_data`: Stores real-time data points

#### 2. **API Keys for Live Data Sources**

**Twitter/X API:**
- **Cost**: $100/month for basic tier
- **Setup**: Twitter Developer Portal → Create App → Get Bearer Token
- **Rate Limits**: 300 requests per 15 minutes

**NewsAPI:**
- **Cost**: Free tier (1000 requests/day), $449/month for production
- **Setup**: newsapi.org → Register → Get API Key
- **Rate Limits**: 1000 requests/day (free), unlimited (paid)

**Reddit API:**
- **Cost**: Free
- **Setup**: reddit.com/prefs/apps → Create App → Get credentials
- **Rate Limits**: 60 requests per minute

**Alternative Free Options:**
- RSS feeds (no API key needed)
- Public APIs with no authentication
- Custom webhook endpoints

## 🎯 Supabase Integration (Automated)

### What Happens When You Connect Supabase:

1. **Automatic Database Setup**:
   ```sql
   -- API Endpoints table
   CREATE TABLE api_endpoints (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     url TEXT NOT NULL,
     method TEXT DEFAULT 'GET',
     headers JSONB DEFAULT '{}',
     auth_type TEXT DEFAULT 'none',
     auth_value TEXT,
     data_mapping JSONB NOT NULL,
     is_active BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Live Data table
   CREATE TABLE live_data (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     endpoint_id UUID REFERENCES api_endpoints(id),
     raw_data JSONB NOT NULL,
     processed_data JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );
   ```

2. **Real-time Subscriptions**: Automatic updates when new data arrives
3. **Data Processing Pipeline**: Raw API data → Sentiment Analysis → Database Storage
4. **Security**: Row Level Security (RLS) enabled by default

### Setup Process:
1. Click "Connect to Supabase" in the app header
2. Create new Supabase project or connect existing one
3. Database tables are automatically created
4. Start adding API endpoints through the Live Data Manager

## 📊 Live Preview System

### How It Works:

1. **Add API Endpoint**: Use the Live Data Manager to add your API details
2. **Test Connection**: Built-in testing to verify API connectivity
3. **Auto-Processing**: Raw data is automatically converted to sentiment data
4. **Real-time Updates**: New data appears on map and dashboard immediately
5. **Data Storage**: All data is stored in Supabase for historical analysis

### Supported API Formats:
- **JSON Arrays**: `[{...}, {...}]`
- **Nested Objects**: `{data: [{...}], meta: {...}}`
- **Single Objects**: `{text: "...", timestamp: "..."}`

### Quick Setup Templates:
- **NewsAPI**: Pre-configured for news headlines
- **Reddit**: Ready for subreddit posts
- **Custom API**: Flexible template for any JSON API

## 🔒 Security & Best Practices

- **API Keys**: Stored securely in Supabase, never exposed to frontend
- **Rate Limiting**: Built-in protection against API rate limits
- **Error Handling**: Graceful handling of API failures
- **Data Validation**: All incoming data is validated and sanitized
- **CORS Handling**: Proper cross-origin request management

## 🚀 Getting Started

1. **Upload Sample Data**: Download and upload the sample CSV to see the app in action
2. **Connect Supabase**: Click the "Connect to Supabase" button for live data features
3. **Add API Endpoints**: Use the Live Data Manager to connect your data sources
4. **Explore Features**: Try all four views (Map, Timeline, Dashboard, Keywords)
5. **Export Results**: Save your insights for external use

The app is designed to work immediately with uploaded data, and scales to handle real-time data streams with minimal setup required!
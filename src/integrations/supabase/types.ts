export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  _analytics: {
    Tables: {
      alert_queries: {
        Row: {
          cron: string | null
          description: string | null
          id: number
          inserted_at: string
          language: string | null
          name: string | null
          query: string | null
          slack_hook_url: string | null
          source_mapping: Json | null
          token: string | null
          updated_at: string
          user_id: number | null
          webhook_notification_url: string | null
        }
        Insert: {
          cron?: string | null
          description?: string | null
          id?: number
          inserted_at: string
          language?: string | null
          name?: string | null
          query?: string | null
          slack_hook_url?: string | null
          source_mapping?: Json | null
          token?: string | null
          updated_at: string
          user_id?: number | null
          webhook_notification_url?: string | null
        }
        Update: {
          cron?: string | null
          description?: string | null
          id?: number
          inserted_at?: string
          language?: string | null
          name?: string | null
          query?: string | null
          slack_hook_url?: string | null
          source_mapping?: Json | null
          token?: string | null
          updated_at?: string
          user_id?: number | null
          webhook_notification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_queries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_queries_backends: {
        Row: {
          alert_query_id: number | null
          backend_id: number | null
          id: number
        }
        Insert: {
          alert_query_id?: number | null
          backend_id?: number | null
          id?: number
        }
        Update: {
          alert_query_id?: number | null
          backend_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "alert_queries_backends_alert_query_id_fkey"
            columns: ["alert_query_id"]
            referencedRelation: "alert_queries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_queries_backends_backend_id_fkey"
            columns: ["backend_id"]
            referencedRelation: "backends"
            referencedColumns: ["id"]
          },
        ]
      }
      backends: {
        Row: {
          config: Json | null
          config_encrypted: string | null
          default_ingest: boolean | null
          description: string | null
          id: number
          inserted_at: string
          metadata: Json | null
          name: string | null
          token: string
          type: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          config?: Json | null
          config_encrypted?: string | null
          default_ingest?: boolean | null
          description?: string | null
          id?: number
          inserted_at: string
          metadata?: Json | null
          name?: string | null
          token: string
          type?: string | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          config?: Json | null
          config_encrypted?: string | null
          default_ingest?: boolean | null
          description?: string | null
          id?: number
          inserted_at?: string
          metadata?: Json | null
          name?: string | null
          token?: string
          type?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "backends_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_accounts: {
        Row: {
          custom_invoice_fields: Json[] | null
          default_payment_method: string | null
          id: number
          inserted_at: string
          latest_successful_stripe_session: Json | null
          lifetime_plan: boolean
          lifetime_plan_invoice: string | null
          "lifetime_plan?": boolean | null
          stripe_customer: string | null
          stripe_invoices: Json | null
          stripe_subscriptions: Json | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          custom_invoice_fields?: Json[] | null
          default_payment_method?: string | null
          id?: number
          inserted_at: string
          latest_successful_stripe_session?: Json | null
          lifetime_plan?: boolean
          lifetime_plan_invoice?: string | null
          "lifetime_plan?"?: boolean | null
          stripe_customer?: string | null
          stripe_invoices?: Json | null
          stripe_subscriptions?: Json | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          custom_invoice_fields?: Json[] | null
          default_payment_method?: string | null
          id?: number
          inserted_at?: string
          latest_successful_stripe_session?: Json | null
          lifetime_plan?: boolean
          lifetime_plan_invoice?: string | null
          "lifetime_plan?"?: boolean | null
          stripe_customer?: string | null
          stripe_invoices?: Json | null
          stripe_subscriptions?: Json | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_counts: {
        Row: {
          count: number | null
          id: number
          inserted_at: string
          node: string | null
          source_id: number | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          count?: number | null
          id?: number
          inserted_at: string
          node?: string | null
          source_id?: number | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          count?: number | null
          id?: number
          inserted_at?: string
          node?: string | null
          source_id?: number | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_counts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      endpoint_queries: {
        Row: {
          backend_id: number | null
          cache_duration_seconds: number | null
          description: string | null
          enable_auth: boolean | null
          id: number
          inserted_at: string
          labels: string | null
          language: string
          max_limit: number | null
          name: string | null
          proactive_requerying_seconds: number | null
          query: string | null
          redact_pii: boolean
          sandbox_query_id: number | null
          sandboxable: boolean | null
          source_mapping: Json
          token: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          backend_id?: number | null
          cache_duration_seconds?: number | null
          description?: string | null
          enable_auth?: boolean | null
          id?: number
          inserted_at: string
          labels?: string | null
          language: string
          max_limit?: number | null
          name?: string | null
          proactive_requerying_seconds?: number | null
          query?: string | null
          redact_pii?: boolean
          sandbox_query_id?: number | null
          sandboxable?: boolean | null
          source_mapping?: Json
          token?: string | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          backend_id?: number | null
          cache_duration_seconds?: number | null
          description?: string | null
          enable_auth?: boolean | null
          id?: number
          inserted_at?: string
          labels?: string | null
          language?: string
          max_limit?: number | null
          name?: string | null
          proactive_requerying_seconds?: number | null
          query?: string | null
          redact_pii?: boolean
          sandbox_query_id?: number | null
          sandboxable?: boolean | null
          source_mapping?: Json
          token?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "endpoint_queries_backend_id_fkey"
            columns: ["backend_id"]
            referencedRelation: "backends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "endpoint_queries_sandbox_query_id_fkey"
            columns: ["sandbox_query_id"]
            referencedRelation: "endpoint_queries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "endpoint_queries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      log_events_0049c074_10a9_4533_869a_da1cd8af2673: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_04fe5a3f_27d0_4684_b8bf_1a3d690cea3f: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_18c435fb_c6a5_461e_ac73_20a8ef0cc466: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_20836687_05e5_416c_8fa3_f25715a80a9c: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_4418ebce_7034_4281_b8bc_abcd33615cb4: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_483848c6_cdca_408b_a934_3f6714a25389: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_61d7899d_c99a_45fb_98a3_a1651e5600a5: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_c278397e_12f2_4f1f_911c_bee9487d9ce4: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      log_events_c3d86f8e_e391_47d0_8dbb_0498a48c99e4: {
        Row: {
          body: Json | null
          event_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          body?: Json | null
          event_message?: string | null
          id: string
          timestamp?: string | null
        }
        Update: {
          body?: Json | null
          event_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      oauth_access_grants: {
        Row: {
          application_id: number | null
          expires_in: number
          id: number
          inserted_at: string
          redirect_uri: string
          resource_owner_id: number
          revoked_at: string | null
          scopes: string | null
          token: string
        }
        Insert: {
          application_id?: number | null
          expires_in: number
          id?: number
          inserted_at: string
          redirect_uri: string
          resource_owner_id: number
          revoked_at?: string | null
          scopes?: string | null
          token: string
        }
        Update: {
          application_id?: number | null
          expires_in?: number
          id?: number
          inserted_at?: string
          redirect_uri?: string
          resource_owner_id?: number
          revoked_at?: string | null
          scopes?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_access_grants_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "oauth_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_access_tokens: {
        Row: {
          application_id: number | null
          description: string | null
          expires_in: number | null
          id: number
          inserted_at: string
          previous_refresh_token: string
          refresh_token: string | null
          resource_owner_id: number | null
          revoked_at: string | null
          scopes: string | null
          token: string
          updated_at: string
        }
        Insert: {
          application_id?: number | null
          description?: string | null
          expires_in?: number | null
          id?: number
          inserted_at: string
          previous_refresh_token?: string
          refresh_token?: string | null
          resource_owner_id?: number | null
          revoked_at?: string | null
          scopes?: string | null
          token: string
          updated_at: string
        }
        Update: {
          application_id?: number | null
          description?: string | null
          expires_in?: number | null
          id?: number
          inserted_at?: string
          previous_refresh_token?: string
          refresh_token?: string | null
          resource_owner_id?: number | null
          revoked_at?: string | null
          scopes?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_access_tokens_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "oauth_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_applications: {
        Row: {
          id: number
          inserted_at: string
          name: string
          owner_id: number
          redirect_uri: string
          scopes: string
          secret: string
          uid: string
          updated_at: string
        }
        Insert: {
          id?: number
          inserted_at: string
          name: string
          owner_id: number
          redirect_uri: string
          scopes?: string
          secret?: string
          uid: string
          updated_at: string
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string
          owner_id?: number
          redirect_uri?: string
          scopes?: string
          secret?: string
          uid?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_users: {
        Row: {
          id: number
          partner_id: number | null
          upgraded: boolean
          user_id: number | null
        }
        Insert: {
          id?: number
          partner_id?: number | null
          upgraded?: boolean
          user_id?: number | null
        }
        Update: {
          id?: number
          partner_id?: number | null
          upgraded?: boolean
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          id: number
          name: string | null
          token: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          token?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          token?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string | null
          customer_id: string | null
          exp_month: number | null
          exp_year: number | null
          id: number
          inserted_at: string
          last_four: string | null
          price_id: string | null
          stripe_id: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          customer_id?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: number
          inserted_at: string
          last_four?: string | null
          price_id?: string | null
          stripe_id?: string | null
          updated_at: string
        }
        Update: {
          brand?: string | null
          customer_id?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: number
          inserted_at?: string
          last_four?: string | null
          price_id?: string | null
          stripe_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "billing_accounts"
            referencedColumns: ["stripe_customer"]
          },
        ]
      }
      plans: {
        Row: {
          id: number
          inserted_at: string
          limit_alert_freq: number | null
          limit_rate_limit: number | null
          limit_saved_search_limit: number | null
          limit_source_fields_limit: number | null
          limit_source_rate_limit: number | null
          limit_source_ttl: number | null
          limit_sources: number | null
          limit_team_users_limit: number | null
          name: string | null
          period: string | null
          price: number | null
          stripe_id: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          inserted_at: string
          limit_alert_freq?: number | null
          limit_rate_limit?: number | null
          limit_saved_search_limit?: number | null
          limit_source_fields_limit?: number | null
          limit_source_rate_limit?: number | null
          limit_source_ttl?: number | null
          limit_sources?: number | null
          limit_team_users_limit?: number | null
          name?: string | null
          period?: string | null
          price?: number | null
          stripe_id?: string | null
          type?: string | null
          updated_at: string
        }
        Update: {
          id?: number
          inserted_at?: string
          limit_alert_freq?: number | null
          limit_rate_limit?: number | null
          limit_saved_search_limit?: number | null
          limit_source_fields_limit?: number | null
          limit_source_rate_limit?: number | null
          limit_source_ttl?: number | null
          limit_sources?: number | null
          limit_team_users_limit?: number | null
          name?: string | null
          period?: string | null
          price?: number | null
          stripe_id?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          backend_id: number | null
          id: number
          inserted_at: string
          lql_filters: string
          lql_string: string
          regex: string | null
          regex_struct: string | null
          sink: string | null
          source_id: number
          token: string | null
          updated_at: string
        }
        Insert: {
          backend_id?: number | null
          id?: number
          inserted_at: string
          lql_filters?: string
          lql_string?: string
          regex?: string | null
          regex_struct?: string | null
          sink?: string | null
          source_id: number
          token?: string | null
          updated_at: string
        }
        Update: {
          backend_id?: number | null
          id?: number
          inserted_at?: string
          lql_filters?: string
          lql_string?: string
          regex?: string | null
          regex_struct?: string | null
          sink?: string | null
          source_id?: number
          token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rules_backend_id_fkey"
            columns: ["backend_id"]
            referencedRelation: "backends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rules_sink_fkey"
            columns: ["sink"]
            referencedRelation: "sources"
            referencedColumns: ["token"]
          },
          {
            foreignKeyName: "rules_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_search_counters: {
        Row: {
          granularity: string
          id: number
          non_tailing_count: number | null
          saved_search_id: number
          tailing_count: number | null
          timestamp: string
        }
        Insert: {
          granularity?: string
          id?: number
          non_tailing_count?: number | null
          saved_search_id: number
          tailing_count?: number | null
          timestamp: string
        }
        Update: {
          granularity?: string
          id?: number
          non_tailing_count?: number | null
          saved_search_id?: number
          tailing_count?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_search_counters_saved_search_id_fkey"
            columns: ["saved_search_id"]
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          id: number
          inserted_at: string
          lql_charts: Json | null
          lql_filters: Json | null
          querystring: string | null
          saved_by_user: boolean | null
          source_id: number | null
          tailing: boolean
          "tailing?": boolean
          updated_at: string
        }
        Insert: {
          id?: number
          inserted_at: string
          lql_charts?: Json | null
          lql_filters?: Json | null
          querystring?: string | null
          saved_by_user?: boolean | null
          source_id?: number | null
          tailing?: boolean
          "tailing?"?: boolean
          updated_at: string
        }
        Update: {
          id?: number
          inserted_at?: string
          lql_charts?: Json | null
          lql_filters?: Json | null
          querystring?: string | null
          saved_by_user?: boolean | null
          source_id?: number | null
          tailing?: boolean
          "tailing?"?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      source_backends: {
        Row: {
          config: Json | null
          id: number
          inserted_at: string
          source_id: number | null
          type: string | null
          updated_at: string
        }
        Insert: {
          config?: Json | null
          id?: number
          inserted_at: string
          source_id?: number | null
          type?: string | null
          updated_at: string
        }
        Update: {
          config?: Json | null
          id?: number
          inserted_at?: string
          source_id?: number | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_backends_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_schemas: {
        Row: {
          bigquery_schema: string | null
          id: number
          inserted_at: string
          schema_flat_map: string | null
          source_id: number | null
          updated_at: string
        }
        Insert: {
          bigquery_schema?: string | null
          id?: number
          inserted_at: string
          schema_flat_map?: string | null
          source_id?: number | null
          updated_at: string
        }
        Update: {
          bigquery_schema?: string | null
          id?: number
          inserted_at?: string
          schema_flat_map?: string | null
          source_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_schemas_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          api_quota: number
          bigquery_clustering_fields: string | null
          bigquery_schema: string | null
          bigquery_table_ttl: number | null
          bq_storage_write_api: boolean | null
          bq_table_partition_type: string | null
          custom_event_message_keys: string | null
          default_ingest_backend_enabled: boolean | null
          disable_tailing: boolean | null
          drop_lql_filters: string
          drop_lql_string: string | null
          favorite: boolean
          id: number
          inserted_at: string
          lock_schema: boolean | null
          log_events_updated_at: string | null
          name: string | null
          notifications: Json
          notifications_every: number | null
          public_token: string | null
          service_name: string | null
          slack_hook_url: string | null
          suggested_keys: string | null
          token: string
          transform_copy_fields: string | null
          updated_at: string
          user_id: number
          v2_pipeline: boolean | null
          validate_schema: boolean | null
          webhook_notification_url: string | null
        }
        Insert: {
          api_quota?: number
          bigquery_clustering_fields?: string | null
          bigquery_schema?: string | null
          bigquery_table_ttl?: number | null
          bq_storage_write_api?: boolean | null
          bq_table_partition_type?: string | null
          custom_event_message_keys?: string | null
          default_ingest_backend_enabled?: boolean | null
          disable_tailing?: boolean | null
          drop_lql_filters?: string
          drop_lql_string?: string | null
          favorite?: boolean
          id?: number
          inserted_at: string
          lock_schema?: boolean | null
          log_events_updated_at?: string | null
          name?: string | null
          notifications?: Json
          notifications_every?: number | null
          public_token?: string | null
          service_name?: string | null
          slack_hook_url?: string | null
          suggested_keys?: string | null
          token: string
          transform_copy_fields?: string | null
          updated_at: string
          user_id: number
          v2_pipeline?: boolean | null
          validate_schema?: boolean | null
          webhook_notification_url?: string | null
        }
        Update: {
          api_quota?: number
          bigquery_clustering_fields?: string | null
          bigquery_schema?: string | null
          bigquery_table_ttl?: number | null
          bq_storage_write_api?: boolean | null
          bq_table_partition_type?: string | null
          custom_event_message_keys?: string | null
          default_ingest_backend_enabled?: boolean | null
          disable_tailing?: boolean | null
          drop_lql_filters?: string
          drop_lql_string?: string | null
          favorite?: boolean
          id?: number
          inserted_at?: string
          lock_schema?: boolean | null
          log_events_updated_at?: string | null
          name?: string | null
          notifications?: Json
          notifications_every?: number | null
          public_token?: string | null
          service_name?: string | null
          slack_hook_url?: string | null
          suggested_keys?: string | null
          token?: string
          transform_copy_fields?: string | null
          updated_at?: string
          user_id?: number
          v2_pipeline?: boolean | null
          validate_schema?: boolean | null
          webhook_notification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sources_backends: {
        Row: {
          backend_id: number | null
          id: number
          source_id: number | null
        }
        Insert: {
          backend_id?: number | null
          id?: number
          source_id?: number | null
        }
        Update: {
          backend_id?: number | null
          id?: number
          source_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_backends_backend_id_fkey"
            columns: ["backend_id"]
            referencedRelation: "backends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_backends_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          all_logs_logged: number | null
          id: number
          inserted_at: string
          node: string | null
          updated_at: string
        }
        Insert: {
          all_logs_logged?: number | null
          id?: number
          inserted_at: string
          node?: string | null
          updated_at: string
        }
        Update: {
          all_logs_logged?: number | null
          id?: number
          inserted_at?: string
          node?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_users: {
        Row: {
          email: string | null
          email_me_product: boolean
          email_preferred: string | null
          id: number
          image: string | null
          inserted_at: string
          name: string | null
          phone: string | null
          preferences: Json | null
          provider: string | null
          provider_uid: string | null
          team_id: number | null
          token: string | null
          updated_at: string
          valid_google_account: boolean
        }
        Insert: {
          email?: string | null
          email_me_product?: boolean
          email_preferred?: string | null
          id?: number
          image?: string | null
          inserted_at: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          provider?: string | null
          provider_uid?: string | null
          team_id?: number | null
          token?: string | null
          updated_at: string
          valid_google_account?: boolean
        }
        Update: {
          email?: string | null
          email_me_product?: boolean
          email_preferred?: string | null
          id?: number
          image?: string | null
          inserted_at?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          provider?: string | null
          provider_uid?: string | null
          team_id?: number | null
          token?: string | null
          updated_at?: string
          valid_google_account?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: number
          inserted_at: string
          name: string | null
          token: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          id?: number
          inserted_at: string
          name?: string | null
          token?: string | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string | null
          token?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          admin: boolean
          api_key: string
          api_quota: number
          bigquery_dataset_id: string | null
          bigquery_dataset_location: string | null
          bigquery_enable_managed_service_accounts: boolean | null
          bigquery_processed_bytes_limit: number
          bigquery_project_id: string | null
          bigquery_reservation_alerts: string | null
          bigquery_reservation_search: string | null
          bigquery_udfs_hash: string
          billing_enabled: boolean
          "billing_enabled?": boolean
          company: string | null
          email: string | null
          email_me_product: boolean
          email_preferred: string | null
          endpoints_beta: boolean | null
          id: number
          image: string | null
          inserted_at: string
          metadata: Json | null
          name: string | null
          old_api_key: string | null
          partner_id: number | null
          partner_upgraded: boolean | null
          phone: string | null
          preferences: Json | null
          provider: string
          provider_uid: string
          token: string
          updated_at: string
          valid_google_account: boolean | null
        }
        Insert: {
          admin?: boolean
          api_key: string
          api_quota?: number
          bigquery_dataset_id?: string | null
          bigquery_dataset_location?: string | null
          bigquery_enable_managed_service_accounts?: boolean | null
          bigquery_processed_bytes_limit?: number
          bigquery_project_id?: string | null
          bigquery_reservation_alerts?: string | null
          bigquery_reservation_search?: string | null
          bigquery_udfs_hash?: string
          billing_enabled?: boolean
          "billing_enabled?"?: boolean
          company?: string | null
          email?: string | null
          email_me_product?: boolean
          email_preferred?: string | null
          endpoints_beta?: boolean | null
          id?: number
          image?: string | null
          inserted_at: string
          metadata?: Json | null
          name?: string | null
          old_api_key?: string | null
          partner_id?: number | null
          partner_upgraded?: boolean | null
          phone?: string | null
          preferences?: Json | null
          provider: string
          provider_uid: string
          token: string
          updated_at: string
          valid_google_account?: boolean | null
        }
        Update: {
          admin?: boolean
          api_key?: string
          api_quota?: number
          bigquery_dataset_id?: string | null
          bigquery_dataset_location?: string | null
          bigquery_enable_managed_service_accounts?: boolean | null
          bigquery_processed_bytes_limit?: number
          bigquery_project_id?: string | null
          bigquery_reservation_alerts?: string | null
          bigquery_reservation_search?: string | null
          bigquery_udfs_hash?: string
          billing_enabled?: boolean
          "billing_enabled?"?: boolean
          company?: string | null
          email?: string | null
          email_me_product?: boolean
          email_preferred?: string | null
          endpoints_beta?: boolean | null
          id?: number
          image?: string | null
          inserted_at?: string
          metadata?: Json | null
          name?: string | null
          old_api_key?: string | null
          partner_id?: number | null
          partner_upgraded?: boolean | null
          phone?: string | null
          preferences?: Json | null
          provider?: string
          provider_uid?: string
          token?: string
          updated_at?: string
          valid_google_account?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "users_partner_id_fkey"
            columns: ["partner_id"]
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      vercel_auths: {
        Row: {
          access_token: string | null
          id: number
          inserted_at: string
          installation_id: string | null
          team_id: string | null
          token_type: string | null
          updated_at: string
          user_id: number | null
          vercel_user_id: string | null
        }
        Insert: {
          access_token?: string | null
          id?: number
          inserted_at: string
          installation_id?: string | null
          team_id?: string | null
          token_type?: string | null
          updated_at: string
          user_id?: number | null
          vercel_user_id?: string | null
        }
        Update: {
          access_token?: string | null
          id?: number
          inserted_at?: string
          installation_id?: string | null
          team_id?: string | null
          token_type?: string | null
          updated_at?: string
          user_id?: number | null
          vercel_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vercel_auths_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_logs: {
        Args: { days_to_keep?: number; max_table_size_mb?: number }
        Returns: {
          deleted_rows: number
          reason: string
          table_name: string
          table_size_mb: number
        }[]
      }
      show_table_sizes: {
        Args: { max_table_size_mb?: number }
        Returns: {
          row_count: number
          size_mb: number
          status: string
          table_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  _realtime: {
    Tables: {
      extensions: {
        Row: {
          id: string
          inserted_at: string
          settings: Json | null
          tenant_external_id: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          id: string
          inserted_at: string
          settings?: Json | null
          tenant_external_id?: string | null
          type?: string | null
          updated_at: string
        }
        Update: {
          id?: string
          inserted_at?: string
          settings?: Json | null
          tenant_external_id?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extensions_tenant_external_id_fkey"
            columns: ["tenant_external_id"]
            referencedRelation: "tenants"
            referencedColumns: ["external_id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      tenants: {
        Row: {
          broadcast_adapter: string | null
          external_id: string | null
          id: string
          inserted_at: string
          jwt_jwks: Json | null
          jwt_secret: string | null
          max_bytes_per_second: number
          max_channels_per_client: number
          max_concurrent_users: number
          max_events_per_second: number
          max_joins_per_second: number
          max_payload_size_in_kb: number | null
          max_presence_events_per_second: number | null
          migrations_ran: number | null
          name: string | null
          notify_private_alpha: boolean | null
          postgres_cdc_default: string | null
          private_only: boolean
          suspend: boolean | null
          updated_at: string
        }
        Insert: {
          broadcast_adapter?: string | null
          external_id?: string | null
          id: string
          inserted_at: string
          jwt_jwks?: Json | null
          jwt_secret?: string | null
          max_bytes_per_second?: number
          max_channels_per_client?: number
          max_concurrent_users?: number
          max_events_per_second?: number
          max_joins_per_second?: number
          max_payload_size_in_kb?: number | null
          max_presence_events_per_second?: number | null
          migrations_ran?: number | null
          name?: string | null
          notify_private_alpha?: boolean | null
          postgres_cdc_default?: string | null
          private_only?: boolean
          suspend?: boolean | null
          updated_at: string
        }
        Update: {
          broadcast_adapter?: string | null
          external_id?: string | null
          id?: string
          inserted_at?: string
          jwt_jwks?: Json | null
          jwt_secret?: string | null
          max_bytes_per_second?: number
          max_channels_per_client?: number
          max_concurrent_users?: number
          max_events_per_second?: number
          max_joins_per_second?: number
          max_payload_size_in_kb?: number | null
          max_presence_events_per_second?: number | null
          migrations_ran?: number | null
          name?: string | null
          notify_private_alpha?: boolean | null
          postgres_cdc_default?: string | null
          private_only?: boolean
          suspend?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      config_settings: {
        Row: {
          created_at: string
          id: string
          is_secret: boolean
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_secret?: boolean
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_secret?: boolean
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      custom_oauth_providers: {
        Row: {
          acceptable_client_ids: string[]
          attribute_mapping: Json
          authorization_params: Json
          authorization_url: string | null
          cached_discovery: Json | null
          client_id: string
          client_secret: string
          created_at: string
          discovery_cached_at: string | null
          discovery_url: string | null
          email_optional: boolean
          enabled: boolean
          id: string
          identifier: string
          issuer: string | null
          jwks_uri: string | null
          name: string
          pkce_enabled: boolean
          provider_type: string
          scopes: string[]
          skip_nonce_check: boolean
          token_url: string | null
          updated_at: string
          userinfo_url: string | null
        }
        Insert: {
          acceptable_client_ids?: string[]
          attribute_mapping?: Json
          authorization_params?: Json
          authorization_url?: string | null
          cached_discovery?: Json | null
          client_id: string
          client_secret: string
          created_at?: string
          discovery_cached_at?: string | null
          discovery_url?: string | null
          email_optional?: boolean
          enabled?: boolean
          id?: string
          identifier: string
          issuer?: string | null
          jwks_uri?: string | null
          name: string
          pkce_enabled?: boolean
          provider_type: string
          scopes?: string[]
          skip_nonce_check?: boolean
          token_url?: string | null
          updated_at?: string
          userinfo_url?: string | null
        }
        Update: {
          acceptable_client_ids?: string[]
          attribute_mapping?: Json
          authorization_params?: Json
          authorization_url?: string | null
          cached_discovery?: Json | null
          client_id?: string
          client_secret?: string
          created_at?: string
          discovery_cached_at?: string | null
          discovery_url?: string | null
          email_optional?: boolean
          enabled?: boolean
          id?: string
          identifier?: string
          issuer?: string | null
          jwks_uri?: string | null
          name?: string
          pkce_enabled?: boolean
          provider_type?: string
          scopes?: string[]
          skip_nonce_check?: boolean
          token_url?: string | null
          updated_at?: string
          userinfo_url?: string | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string | null
          auth_code_issued_at: string | null
          authentication_method: string
          code_challenge: string | null
          code_challenge_method:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at: string | null
          email_optional: boolean
          id: string
          invite_token: string | null
          linking_target_id: string | null
          oauth_client_state_id: string | null
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          referrer: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code?: string | null
          auth_code_issued_at?: string | null
          authentication_method: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at?: string | null
          email_optional?: boolean
          id: string
          invite_token?: string | null
          linking_target_id?: string | null
          oauth_client_state_id?: string | null
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          referrer?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string | null
          auth_code_issued_at?: string | null
          authentication_method?: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at?: string | null
          email_optional?: boolean
          id?: string
          invite_token?: string | null
          linking_target_id?: string | null
          oauth_client_state_id?: string | null
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          referrer?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_amr_claims_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code: string | null
          verified_at: string | null
          web_authn_session_data: Json | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_challenges_auth_factor_id_fkey"
            columns: ["factor_id"]
            referencedRelation: "mfa_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name: string | null
          id: string
          last_challenged_at: string | null
          last_webauthn_challenge_data: Json | null
          phone: string | null
          secret: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid: string | null
          web_authn_credential: Json | null
        }
        Insert: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id: string
          last_challenged_at?: string | null
          last_webauthn_challenge_data?: Json | null
          phone?: string | null
          secret?: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Update: {
          created_at?: string
          factor_type?: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id?: string
          last_challenged_at?: string | null
          last_webauthn_challenge_data?: Json | null
          phone?: string | null
          secret?: string | null
          status?: Database["auth"]["Enums"]["factor_status"]
          updated_at?: string
          user_id?: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_factors_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_authorizations: {
        Row: {
          approved_at: string | null
          authorization_code: string | null
          authorization_id: string
          client_id: string
          code_challenge: string | null
          code_challenge_method:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at: string
          expires_at: string
          id: string
          nonce: string | null
          redirect_uri: string
          resource: string | null
          response_type: Database["auth"]["Enums"]["oauth_response_type"]
          scope: string
          state: string | null
          status: Database["auth"]["Enums"]["oauth_authorization_status"]
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          authorization_code?: string | null
          authorization_id: string
          client_id: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at?: string
          expires_at?: string
          id: string
          nonce?: string | null
          redirect_uri: string
          resource?: string | null
          response_type?: Database["auth"]["Enums"]["oauth_response_type"]
          scope: string
          state?: string | null
          status?: Database["auth"]["Enums"]["oauth_authorization_status"]
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          authorization_code?: string | null
          authorization_id?: string
          client_id?: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database["auth"]["Enums"]["code_challenge_method"]
            | null
          created_at?: string
          expires_at?: string
          id?: string
          nonce?: string | null
          redirect_uri?: string
          resource?: string | null
          response_type?: Database["auth"]["Enums"]["oauth_response_type"]
          scope?: string
          state?: string | null
          status?: Database["auth"]["Enums"]["oauth_authorization_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_authorizations_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "oauth_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oauth_authorizations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_client_states: {
        Row: {
          code_verifier: string | null
          created_at: string
          id: string
          provider_type: string
        }
        Insert: {
          code_verifier?: string | null
          created_at: string
          id: string
          provider_type: string
        }
        Update: {
          code_verifier?: string | null
          created_at?: string
          id?: string
          provider_type?: string
        }
        Relationships: []
      }
      oauth_clients: {
        Row: {
          client_name: string | null
          client_secret_hash: string | null
          client_type: Database["auth"]["Enums"]["oauth_client_type"]
          client_uri: string | null
          created_at: string
          deleted_at: string | null
          grant_types: string
          id: string
          logo_uri: string | null
          redirect_uris: string
          registration_type: Database["auth"]["Enums"]["oauth_registration_type"]
          token_endpoint_auth_method: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          client_secret_hash?: string | null
          client_type?: Database["auth"]["Enums"]["oauth_client_type"]
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types: string
          id: string
          logo_uri?: string | null
          redirect_uris: string
          registration_type: Database["auth"]["Enums"]["oauth_registration_type"]
          token_endpoint_auth_method: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          client_secret_hash?: string | null
          client_type?: Database["auth"]["Enums"]["oauth_client_type"]
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types?: string
          id?: string
          logo_uri?: string | null
          redirect_uris?: string
          registration_type?: Database["auth"]["Enums"]["oauth_registration_type"]
          token_endpoint_auth_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      oauth_consents: {
        Row: {
          client_id: string
          granted_at: string
          id: string
          revoked_at: string | null
          scopes: string
          user_id: string
        }
        Insert: {
          client_id: string
          granted_at?: string
          id: string
          revoked_at?: string | null
          scopes: string
          user_id: string
        }
        Update: {
          client_id?: string
          granted_at?: string
          id?: string
          revoked_at?: string | null
          scopes?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_consents_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "oauth_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oauth_consents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      one_time_tokens: {
        Row: {
          created_at: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relates_to?: string
          token_hash?: string
          token_type?: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "one_time_tokens_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          name_id_format: string | null
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          name_id_format?: string | null
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          name_id_format?: string | null
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_providers_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          flow_state_id: string | null
          for_email: string | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_relay_states_flow_state_id_fkey"
            columns: ["flow_state_id"]
            referencedRelation: "flow_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saml_relay_states_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database["auth"]["Enums"]["aal_level"] | null
          created_at: string | null
          factor_id: string | null
          id: string
          ip: unknown | null
          not_after: string | null
          oauth_client_id: string | null
          refresh_token_counter: number | null
          refresh_token_hmac_key: string | null
          refreshed_at: string | null
          scopes: string | null
          tag: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          ip?: unknown | null
          not_after?: string | null
          oauth_client_id?: string | null
          refresh_token_counter?: number | null
          refresh_token_hmac_key?: string | null
          refreshed_at?: string | null
          scopes?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          ip?: unknown | null
          not_after?: string | null
          oauth_client_id?: string | null
          refresh_token_counter?: number | null
          refresh_token_hmac_key?: string | null
          refreshed_at?: string | null
          scopes?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_oauth_client_id_fkey"
            columns: ["oauth_client_id"]
            referencedRelation: "oauth_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_domains_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          disabled: boolean | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          disabled?: boolean | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          disabled?: boolean | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_anonymous: boolean
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webauthn_challenges: {
        Row: {
          challenge_type: string
          created_at: string
          expires_at: string
          id: string
          session_data: Json
          user_id: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string
          expires_at: string
          id?: string
          session_data: Json
          user_id?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          session_data?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webauthn_challenges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webauthn_credentials: {
        Row: {
          aaguid: string | null
          attestation_type: string
          backed_up: boolean
          backup_eligible: boolean
          created_at: string
          credential_id: string
          friendly_name: string
          id: string
          last_used_at: string | null
          public_key: string
          sign_count: number
          transports: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          aaguid?: string | null
          attestation_type?: string
          backed_up?: boolean
          backup_eligible?: boolean
          created_at?: string
          credential_id: string
          friendly_name?: string
          id?: string
          last_used_at?: string | null
          public_key: string
          sign_count?: number
          transports?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          aaguid?: string | null
          attestation_type?: string
          backed_up?: boolean
          backup_eligible?: boolean
          created_at?: string
          credential_id?: string
          friendly_name?: string
          id?: string
          last_used_at?: string | null
          public_key?: string
          sign_count?: number
          transports?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webauthn_credentials_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn" | "phone"
      oauth_authorization_status: "pending" | "approved" | "denied" | "expired"
      oauth_client_type: "public" | "confidential"
      oauth_registration_type: "dynamic" | "manual"
      oauth_response_type: "code"
      one_time_token_type:
        | "confirmation_token"
        | "reauthentication_token"
        | "recovery_token"
        | "email_change_token_new"
        | "email_change_token_current"
        | "phone_change_token"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  cron: {
    Tables: {
      job: {
        Row: {
          active: boolean
          command: string
          database: string
          jobid: number
          jobname: string | null
          nodename: string
          nodeport: number
          schedule: string
          username: string
        }
        Insert: {
          active?: boolean
          command: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule: string
          username?: string
        }
        Update: {
          active?: boolean
          command?: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule?: string
          username?: string
        }
        Relationships: []
      }
      job_run_details: {
        Row: {
          command: string | null
          database: string | null
          end_time: string | null
          job_pid: number | null
          jobid: number | null
          return_message: string | null
          runid: number
          start_time: string | null
          status: string | null
          username: string | null
        }
        Insert: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Update: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alter_job: {
        Args: {
          active?: boolean
          command?: string
          database?: string
          job_id: number
          schedule?: string
          username?: string
        }
        Returns: undefined
      }
      schedule: {
        Args:
          | { command: string; job_name: string; schedule: string }
          | { command: string; schedule: string }
        Returns: number
      }
      schedule_in_database: {
        Args: {
          active?: boolean
          command: string
          database: string
          job_name: string
          schedule: string
          username?: string
        }
        Returns: number
      }
      unschedule: {
        Args: { job_id: number } | { job_name: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  extensions: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      pg_stat_statements: {
        Row: {
          blk_read_time: number | null
          blk_write_time: number | null
          calls: number | null
          dbid: unknown | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          min_exec_time: number | null
          min_plan_time: number | null
          plans: number | null
          query: string | null
          queryid: number | null
          rows: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null
          stats_reset: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      algorithm_sign: {
        Args: { algorithm: string; secret: string; signables: string }
        Returns: string
      }
      armor: {
        Args: { "": string }
        Returns: string
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      pg_stat_statements: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_statements_info: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      pg_stat_statements_reset: {
        Args: { dbid?: unknown; queryid?: number; userid?: unknown }
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      sign: {
        Args: { algorithm?: string; payload: Json; secret: string }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      try_cast_double: {
        Args: { inp: string }
        Returns: number
      }
      url_decode: {
        Args: { data: string }
        Returns: string
      }
      url_encode: {
        Args: { data: string }
        Returns: string
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify: {
        Args: { algorithm?: string; secret: string; token: string }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _internal_resolve: {
        Args: {
          extensions?: Json
          operationName?: string
          query: string
          variables?: Json
        }
        Returns: Json
      }
      comment_directive: {
        Args: { comment_: string }
        Returns: Json
      }
      exception: {
        Args: { message: string }
        Returns: string
      }
      get_schema_version: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      resolve: {
        Args: {
          extensions?: Json
          operationName?: string
          query: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  net: {
    Tables: {
      _http_response: {
        Row: {
          content: string | null
          content_type: string | null
          created: string
          error_msg: string | null
          headers: Json | null
          id: number | null
          status_code: number | null
          timed_out: boolean | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Relationships: []
      }
      http_request_queue: {
        Row: {
          body: string | null
          headers: Json
          id: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Insert: {
          body?: string | null
          headers: Json
          id?: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Update: {
          body?: string | null
          headers?: Json
          id?: number
          method?: string
          timeout_milliseconds?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _await_response: {
        Args: { request_id: number }
        Returns: boolean
      }
      _encode_url_with_params_array: {
        Args: { params_array: string[]; url: string }
        Returns: string
      }
      _http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      _urlencode_string: {
        Args: { string: string }
        Returns: string
      }
      check_worker_is_up: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      http_delete: {
        Args: {
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_get: {
        Args: {
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_post: {
        Args: {
          body?: Json
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      worker_restart: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      request_status: "PENDING" | "SUCCESS" | "ERROR"
    }
    CompositeTypes: {
      http_response: {
        status_code: number | null
        headers: Json | null
        body: string | null
      }
      http_response_result: {
        status: Database["net"]["Enums"]["request_status"] | null
        message: string | null
        response: Database["net"]["CompositeTypes"]["http_response"] | null
      }
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          password: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_assessments: {
        Row: {
          ai_assessment_id: string
          assessment_id: string | null
          created_at: string
          employee_id: string
          evidence: Json | null
          fallback: boolean
          follow_up_suggestions: Json | null
          manager_playbook: Json | null
          model: string | null
          recommended_interventions: Json | null
          risk_summary: string | null
          root_causes: Json | null
        }
        Insert: {
          ai_assessment_id?: string
          assessment_id?: string | null
          created_at?: string
          employee_id: string
          evidence?: Json | null
          fallback?: boolean
          follow_up_suggestions?: Json | null
          manager_playbook?: Json | null
          model?: string | null
          recommended_interventions?: Json | null
          risk_summary?: string | null
          root_causes?: Json | null
        }
        Update: {
          ai_assessment_id?: string
          assessment_id?: string | null
          created_at?: string
          employee_id?: string
          evidence?: Json | null
          fallback?: boolean
          follow_up_suggestions?: Json | null
          manager_playbook?: Json | null
          model?: string | null
          recommended_interventions?: Json | null
          risk_summary?: string | null
          root_causes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            referencedRelation: "risk_assessments"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "ai_assessments_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      approvals: {
        Row: {
          approval_id: string
          comment: string | null
          created_at: string
          decision: string
          intervention_id: string
          manager_id: string | null
        }
        Insert: {
          approval_id?: string
          comment?: string | null
          created_at?: string
          decision: string
          intervention_id: string
          manager_id?: string | null
        }
        Update: {
          approval_id?: string
          comment?: string | null
          created_at?: string
          decision?: string
          intervention_id?: string
          manager_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_intervention_id_fkey"
            columns: ["intervention_id"]
            referencedRelation: "interventions"
            referencedColumns: ["intervention_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          audit_id: number
          entity_id: string | null
          entity_type: string | null
          metadata: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          audit_id?: never
          entity_id?: string | null
          entity_type?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          audit_id?: never
          entity_id?: string | null
          entity_type?: string | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          avg_engagement: number | null
          budget: number | null
          created_at: string
          department_id: string
          department_name: string
          headcount: number | null
        }
        Insert: {
          avg_engagement?: number | null
          budget?: number | null
          created_at?: string
          department_id: string
          department_name: string
          headcount?: number | null
        }
        Update: {
          avg_engagement?: number | null
          budget?: number | null
          created_at?: string
          department_id?: string
          department_name?: string
          headcount?: number | null
        }
        Relationships: []
      }
      departures: {
        Row: {
          created_at: string
          departure_date: string | null
          departure_reason: string | null
          employee_id: string
          id: number
          risk_score_at_departure: number | null
          tenure_at_departure: number | null
          was_regretted_loss: boolean | null
        }
        Insert: {
          created_at?: string
          departure_date?: string | null
          departure_reason?: string | null
          employee_id: string
          id?: never
          risk_score_at_departure?: number | null
          tenure_at_departure?: number | null
          was_regretted_loss?: boolean | null
        }
        Update: {
          created_at?: string
          departure_date?: string | null
          departure_reason?: string | null
          employee_id?: string
          id?: never
          risk_score_at_departure?: number | null
          tenure_at_departure?: number | null
          was_regretted_loss?: boolean | null
        }
        Relationships: []
      }
      employee_snapshots: {
        Row: {
          created_at: string
          employee_id: string
          engagement_score: number | null
          id: number
          legacy_work_percentage: number | null
          performance_rating: number | null
          snapshot_date: string
          worked_hours_per_week: number | null
        }
        Insert: {
          created_at?: string
          employee_id: string
          engagement_score?: number | null
          id?: never
          legacy_work_percentage?: number | null
          performance_rating?: number | null
          snapshot_date: string
          worked_hours_per_week?: number | null
        }
        Update: {
          created_at?: string
          employee_id?: string
          engagement_score?: number | null
          id?: never
          legacy_work_percentage?: number | null
          performance_rating?: number | null
          snapshot_date?: string
          worked_hours_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_snapshots_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department: string
          employee_id: string
          engagement_score: number | null
          engagement_trend: string | null
          experience_years: number | null
          full_name: string
          hire_date: string | null
          job_title: string | null
          last_promotion_date: string | null
          last_review_date: string | null
          legacy_work_percentage: number | null
          location: string | null
          manager_id: string | null
          months_since_promotion: number | null
          months_since_review: number | null
          one_on_one_summary: string | null
          performance_rating: number | null
          performance_rating_source: number | null
          performance_trend: string | null
          recognition_score: number | null
          salary_inr: number | null
          status: string
          strategic_work_percentage: number | null
          tenure_months: number | null
          updated_at: string
          work_mode: string | null
          worked_hours_per_week: number | null
          workload_trend: string | null
        }
        Insert: {
          created_at?: string
          department: string
          employee_id: string
          engagement_score?: number | null
          engagement_trend?: string | null
          experience_years?: number | null
          full_name: string
          hire_date?: string | null
          job_title?: string | null
          last_promotion_date?: string | null
          last_review_date?: string | null
          legacy_work_percentage?: number | null
          location?: string | null
          manager_id?: string | null
          months_since_promotion?: number | null
          months_since_review?: number | null
          one_on_one_summary?: string | null
          performance_rating?: number | null
          performance_rating_source?: number | null
          performance_trend?: string | null
          recognition_score?: number | null
          salary_inr?: number | null
          status?: string
          strategic_work_percentage?: number | null
          tenure_months?: number | null
          updated_at?: string
          work_mode?: string | null
          worked_hours_per_week?: number | null
          workload_trend?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          employee_id?: string
          engagement_score?: number | null
          engagement_trend?: string | null
          experience_years?: number | null
          full_name?: string
          hire_date?: string | null
          job_title?: string | null
          last_promotion_date?: string | null
          last_review_date?: string | null
          legacy_work_percentage?: number | null
          location?: string | null
          manager_id?: string | null
          months_since_promotion?: number | null
          months_since_review?: number | null
          one_on_one_summary?: string | null
          performance_rating?: number | null
          performance_rating_source?: number | null
          performance_trend?: string | null
          recognition_score?: number | null
          salary_inr?: number | null
          status?: string
          strategic_work_percentage?: number | null
          tenure_months?: number | null
          updated_at?: string
          work_mode?: string | null
          worked_hours_per_week?: number | null
          workload_trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            referencedRelation: "managers"
            referencedColumns: ["manager_id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          after_value: number | null
          before_value: number | null
          created_at: string
          effectiveness: string | null
          employee_id: string
          follow_up_date: string | null
          follow_up_id: string
          intervention_id: string | null
          notes: string | null
          outcome: string | null
          simulated: boolean
          still_employed: boolean | null
        }
        Insert: {
          after_value?: number | null
          before_value?: number | null
          created_at?: string
          effectiveness?: string | null
          employee_id: string
          follow_up_date?: string | null
          follow_up_id?: string
          intervention_id?: string | null
          notes?: string | null
          outcome?: string | null
          simulated?: boolean
          still_employed?: boolean | null
        }
        Update: {
          after_value?: number | null
          before_value?: number | null
          created_at?: string
          effectiveness?: string | null
          employee_id?: string
          follow_up_date?: string | null
          follow_up_id?: string
          intervention_id?: string | null
          notes?: string | null
          outcome?: string | null
          simulated?: boolean
          still_employed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "follow_ups_intervention_id_fkey"
            columns: ["intervention_id"]
            referencedRelation: "interventions"
            referencedColumns: ["intervention_id"]
          },
        ]
      }
      interventions: {
        Row: {
          approval_status: string | null
          assessment_id: string | null
          completed_at: string | null
          cost_estimate: number | null
          created_at: string
          due_date: string | null
          employee_id: string
          implementation_status: string | null
          intervention_id: string
          intervention_type: string | null
          owner: string | null
          reason: string | null
          recommendation: string | null
          recommended_by: string | null
          risk_after: number | null
          risk_before: number | null
          source_intervention_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          assessment_id?: string | null
          completed_at?: string | null
          cost_estimate?: number | null
          created_at?: string
          due_date?: string | null
          employee_id: string
          implementation_status?: string | null
          intervention_id?: string
          intervention_type?: string | null
          owner?: string | null
          reason?: string | null
          recommendation?: string | null
          recommended_by?: string | null
          risk_after?: number | null
          risk_before?: number | null
          source_intervention_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          assessment_id?: string | null
          completed_at?: string | null
          cost_estimate?: number | null
          created_at?: string
          due_date?: string | null
          employee_id?: string
          implementation_status?: string | null
          intervention_id?: string
          intervention_type?: string | null
          owner?: string | null
          reason?: string | null
          recommendation?: string | null
          recommended_by?: string | null
          risk_after?: number | null
          risk_before?: number | null
          source_intervention_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_assessment_id_fkey"
            columns: ["assessment_id"]
            referencedRelation: "risk_assessments"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "interventions_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      managers: {
        Row: {
          created_at: string
          department: string | null
          manager_id: string
          manager_name: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          manager_id: string
          manager_name?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          manager_id?: string
          manager_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          manager_id: string | null
          role: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          manager_id?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          manager_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            referencedRelation: "managers"
            referencedColumns: ["manager_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          priority: string | null
          project_id: string
          project_name: string | null
          project_type: string | null
        }
        Insert: {
          created_at?: string
          priority?: string | null
          project_id: string
          project_name?: string | null
          project_type?: string | null
        }
        Update: {
          created_at?: string
          priority?: string | null
          project_id?: string
          project_name?: string | null
          project_type?: string | null
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          assessment_id: string
          assessment_version: number
          calculated_at: string
          confidence_score: number
          created_at: string
          employee_id: string
          inputs_hash: string
          risk_level: string
          risk_score: number
        }
        Insert: {
          assessment_id?: string
          assessment_version?: number
          calculated_at?: string
          confidence_score: number
          created_at?: string
          employee_id: string
          inputs_hash: string
          risk_level: string
          risk_score: number
        }
        Update: {
          assessment_id?: string
          assessment_version?: number
          calculated_at?: string
          confidence_score?: number
          created_at?: string
          employee_id?: string
          inputs_hash?: string
          risk_level?: string
          risk_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      risk_factors: {
        Row: {
          assessment_id: string
          contribution: number
          created_at: string
          evidence: string
          factor_id: string
          factor_name: string
          factor_score: number
          weight: number
        }
        Insert: {
          assessment_id: string
          contribution: number
          created_at?: string
          evidence: string
          factor_id?: string
          factor_name: string
          factor_score: number
          weight: number
        }
        Update: {
          assessment_id?: string
          contribution?: number
          created_at?: string
          evidence?: string
          factor_id?: string
          factor_name?: string
          factor_score?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_factors_assessment_id_fkey"
            columns: ["assessment_id"]
            referencedRelation: "risk_assessments"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      can_access_employee: {
        Args: { emp_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  realtime: {
    Tables: {
      messages: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2026_09_17: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2026_09_18: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2026_09_19: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2026_09_20: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2026_09_21: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      subscription: {
        Row: {
          claims: Json
          claims_role: unknown
          created_at: string
          entity: unknown
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id: number
          subscription_id: string
        }
        Insert: {
          claims: Json
          claims_role?: unknown
          created_at?: string
          entity: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id: string
        }
        Update: {
          claims?: Json
          claims_role?: unknown
          created_at?: string
          entity?: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_rls: {
        Args: { max_record_bytes?: number; wal: Json }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      broadcast_changes: {
        Args: {
          event_name: string
          level?: string
          new: Record<string, unknown>
          old: Record<string, unknown>
          operation: string
          table_name: string
          table_schema: string
          topic_name: string
        }
        Returns: undefined
      }
      build_prepared_statement_sql: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          entity: unknown
          prepared_statement_name: string
        }
        Returns: string
      }
      cast: {
        Args: { type_: unknown; val: string }
        Returns: Json
      }
      check_equality_op: {
        Args: {
          op: Database["realtime"]["Enums"]["equality_op"]
          type_: unknown
          val_1: string
          val_2: string
        }
        Returns: boolean
      }
      is_visible_through_filters: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
        }
        Returns: boolean
      }
      list_changes: {
        Args: {
          max_changes: number
          max_record_bytes: number
          publication: unknown
          slot_name: unknown
        }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      quote_wal2json: {
        Args: { entity: unknown }
        Returns: string
      }
      send: {
        Args: { event: string; payload: Json; private?: boolean; topic: string }
        Returns: undefined
      }
      to_regrole: {
        Args: { role_name: string }
        Returns: unknown
      }
      topic: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      action: "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE" | "ERROR"
      equality_op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in"
    }
    CompositeTypes: {
      user_defined_filter: {
        column_name: string | null
        op: Database["realtime"]["Enums"]["equality_op"] | null
        value: string | null
      }
      wal_column: {
        name: string | null
        type_name: string | null
        type_oid: unknown | null
        value: Json | null
        is_pkey: boolean | null
        is_selectable: boolean | null
      }
      wal_rls: {
        wal: Json | null
        is_rls_enabled: boolean | null
        subscription_ids: string[] | null
        errors: string[] | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      config: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  supabase_functions: {
    Tables: {
      hooks: {
        Row: {
          created_at: string
          hook_name: string
          hook_table_id: number
          id: number
          request_id: number | null
        }
        Insert: {
          created_at?: string
          hook_name: string
          hook_table_id: number
          id?: number
          request_id?: number | null
        }
        Update: {
          created_at?: string
          hook_name?: string
          hook_table_id?: number
          id?: number
          request_id?: number | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          inserted_at: string
          version: string
        }
        Insert: {
          inserted_at?: string
          version: string
        }
        Update: {
          inserted_at?: string
          version?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  vault: {
    Tables: {
      secrets: {
        Row: {
          created_at: string
          description: string
          id: string
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      decrypted_secrets: {
        Row: {
          created_at: string | null
          decrypted_secret: string | null
          description: string | null
          id: string | null
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _crypto_aead_det_decrypt: {
        Args: {
          additional: string
          context?: string
          key_id: number
          message: string
          nonce?: string
        }
        Returns: string
      }
      _crypto_aead_det_encrypt: {
        Args: {
          additional: string
          context?: string
          key_id: number
          message: string
          nonce?: string
        }
        Returns: string
      }
      _crypto_aead_det_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_secret: {
        Args: {
          new_description?: string
          new_key_id?: string
          new_name?: string
          new_secret: string
        }
        Returns: string
      }
      update_secret: {
        Args: {
          new_description?: string
          new_key_id?: string
          new_name?: string
          new_secret?: string
          secret_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  _analytics: {
    Enums: {},
  },
  _realtime: {
    Enums: {},
  },
  auth: {
    Enums: {
      aal_level: ["aal1", "aal2", "aal3"],
      code_challenge_method: ["s256", "plain"],
      factor_status: ["unverified", "verified"],
      factor_type: ["totp", "webauthn", "phone"],
      oauth_authorization_status: ["pending", "approved", "denied", "expired"],
      oauth_client_type: ["public", "confidential"],
      oauth_registration_type: ["dynamic", "manual"],
      oauth_response_type: ["code"],
      one_time_token_type: [
        "confirmation_token",
        "reauthentication_token",
        "recovery_token",
        "email_change_token_new",
        "email_change_token_current",
        "phone_change_token",
      ],
    },
  },
  cron: {
    Enums: {},
  },
  extensions: {
    Enums: {},
  },
  graphql: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  net: {
    Enums: {
      request_status: ["PENDING", "SUCCESS", "ERROR"],
    },
  },
  pgbouncer: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  realtime: {
    Enums: {
      action: ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"],
      equality_op: ["eq", "neq", "lt", "lte", "gt", "gte", "in"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
  supabase_functions: {
    Enums: {},
  },
  vault: {
    Enums: {},
  },
} as const

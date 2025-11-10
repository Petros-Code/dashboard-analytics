"""
Script pour vérifier les schémas et tables
"""
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Lister les schémas
    print("=" * 60)
    print("Schémas disponibles dans la base de données:")
    print("=" * 60)
    result = conn.execute(text("SELECT schema_name FROM information_schema.schemata ORDER BY schema_name"))
    schemas = [row[0] for row in result]
    for schema in schemas:
        print(f"  - {schema}")
    
    print("\n" + "=" * 60)
    print("Tables dans le schéma PUBLIC:")
    print("=" * 60)
    result = conn.execute(text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """))
    tables = [row[0] for row in result]
    for table in tables:
        print(f"  - {table}")
    
    print(f"\nTotal: {len(tables)} tables dans le schéma 'public'")


#define DISALLOW_COPY_AND_ASSIGN(TypeName) \
  TypeName(const TypeName&);               \
  TypeName(TypeName&&);                    \
  void operator=(const TypeName&);          \
  void operator=(TypeName&&);              

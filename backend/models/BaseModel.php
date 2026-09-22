<?php

abstract class BaseModel implements JsonSerializable {
    protected $qb;
    protected $table_name;

    public function __construct($db, $queryBuilder = null) {
        $this->qb = $queryBuilder ?: new QueryBuilder($db);
    }

    
     //Serializes all non-null protected/public properties of the child class.
     //Uses Reflection to ensure properties defined in the child class are visible.
    
    public function jsonSerialize(): array {
        $output = [];
        $reflection = new ReflectionClass($this);
        $properties = $reflection->getProperties();
        
        foreach ($properties as $property) {
            $name = $property->getName();
            if ($name === 'qb' || $name === 'table_name') {
                continue;
            }
            $property->setAccessible(true);
            $value = $property->getValue($this);
            if ($value !== null) {
                $output[$name] = $value;
            }
        }
        
        return $output;
    }
}

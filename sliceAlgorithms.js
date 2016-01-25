function DualityAlgorithm(pointGroupOne, pointGroupTwo)
{
    // Convert to dual represenation
    dualGroupOne = pointGroupOne.map(function(obj){return obj.dual();});
    dualGroupTwo = pointGroupTwo.map(function(obj){return obj.dual();});

    // Find intersections of n-level
    var findAllIntersections = function(obj, lines)
    { 
        var intersections = [];
        for(var i = 0; i < lines.length; i++)
        {
            // Only non-parallel lines intersect
            if(obj.slope() != lines[i].slope())
            {
                intersections.push([obj.intersectionWith(lines[i]),i]);
            }
        }
        return intersections;
    };
    intersectionGroupOne = dualGroupOne.map(function(obj){return findAllIntersections(obj, dualGroupOne);});
    intersectionGroupTwo = dualGroupTwo.map(function(obj){return findAllIntersections(obj, dualGroupTwo);});
    crossGroupIntersections = dualGroupOne.map(function(obj){return findAllIntersections(obj, dualGroupTwo);});

    // Find the left-most intersection, so we can determine the start of the median line (left of that intersection)
    leftMostIntersection = intersectionGroupOne
                            .concat(intersectionGroupTwo)
                            .concat(crossGroupIntersections)
                            .reduceRight(function(a,b){return a.concat(b);}, []) // Flatten lists
                            .map(function(obj){return obj[0].x;})  // Only look at x-values
                            .reduceRight(function(a, b) { return Math.min(a,b);} , Infinity); // Find minimal x-value

    xBeforeAnyIntersection = leftMostIntersection - 1;

    // At this point, we need to check if group sizes are odd or even.
    isOddSized = function(arr) { return arr.length % 2 == 1; }    
    isEvenSized = function(arr) { return arr.length % 2 == 0; }
    if(isOddSized(dualGroupOne) && isOddSized(dualGroupTwo))
    {
        // If both groups are of odd size, the slice will be defined by an intersection of medianlines
        medianIndexG1 = FindIndexOfNthHighestLineAtX(dualGroupOne, Math.floor(dualGroupOne.length/2), xBeforeAnyIntersection);
        medianIndexG2 = FindIndexOfNthHighestLineAtX(dualGroupTwo, Math.floor(dualGroupTwo.length/2), xBeforeAnyIntersection);
        intersections = FindMedianIntersections(dualGroupOne, dualGroupTwo, medianIndexG1, medianIndexG2, intersectionGroupOne, intersectionGroupTwo, xBeforeAnyIntersection);
        if(intersections.length>0)
        {
            return intersections.sort(function(a,b){ return Math.abs(a.x) - Math.abs(b.x); })[0].dual();
        }
    }
    else if(isEvenSized(dualGroupOne)  && isEvenSized(dualGroupTwo))
    {
        // If both groups are of even size, the slice will be defined by an area between the two 'median lines'
        medianIndexG1 = FindIndexOfNthHighestLineAtX(dualGroupOne, Math.floor(dualGroupOne.length/2) - 1, xBeforeAnyIntersection);
        medianIndexG2 = FindIndexOfNthHighestLineAtX(dualGroupOne, Math.floor(dualGroupOne.length/2), xBeforeAnyIntersection);
        intersectionsG1 = FindMedianIntersections(dualGroupOne, dualGroupOne, medianIndexG1, medianIndexG2, intersectionGroupOne, intersectionGroupOne, xBeforeAnyIntersection);
        
        medianIndexG1 = FindIndexOfNthHighestLineAtX(dualGroupTwo, Math.floor(dualGroupTwo.length/2) - 1, xBeforeAnyIntersection);
        medianIndexG2 = FindIndexOfNthHighestLineAtX(dualGroupTwo, Math.floor(dualGroupTwo.length/2), xBeforeAnyIntersection);
        intersectionsG2 = FindMedianIntersections(dualGroupTwo, dualGroupTwo, medianIndexG1, medianIndexG2, intersectionGroupTwo, intersectionGroupTwo, xBeforeAnyIntersection);
        FindSliceEven(dualGroupOne, dualGroupTwo, intersectionGroupOne, intersectionGroupTwo, xBeforeAnyIntersection);
    }
    else
    {

    }
    return new Line(0,0,0,0);
}

function FindIndexOfNthHighestLineAtX(lineGroup, n, x)
{
    yValues =  lineGroup.map(function(obj){return obj.atX(x - 0.5);});

    // Find the y-value of the median line by sorting the lines based on y
    compareNumbers = function(a,b){return a-b;};
    mediany1 = yValues.slice().sort(compareNumbers)[n];

    // Then look up at which index of the unsorted array it is located
    return yValues.indexOf(mediany1);
}

function FindMedianPolygons(lines, intersections, xOfLeftIntersect)
{
    xOfLastIntersect = xOfLeftIntersect;

     // If both groups are of even size, the slice will be defined by an area between the two 'median lines'
    median1G1 = FindIndexOfNthHighestLineAtX(lines, Math.floor(lines.length/2) - 1, xOfLastIntersect);
    median2G1 = FindIndexOfNthHighestLineAtX(lines, Math.floor(lines.length/2), xOfLastIntersect);

    medianPolygons = [];
    intersects = [];

    while(true)
    {
        ni1 = intersections[median1G1]
                        .sort(function(a,b){return a[0].x - b[0].x;})
                        .find(function(obj){return obj[0].x > xOfLastIntersect});
        ni2 = intersections[median2G1]
                        .sort(function(a,b){return a[0].x - b[0].x;})
                        .find(function(obj){return obj[0].x > xOfLastIntersect});
        commonIntersect = false;

        if(ni1 == undefined || ni2 == undefined)
            break;

        // Checking whether or not the two median lines are intersecting
        // We do not check whether the two intersection points are exactly
        // equal, because that gave floating point rounding errors, thus we
        // look at which lines are intersecting.
        if(ni1[1] == median2G1)
        {
            intersects.push(ni1);
            xOfLastIntersect = ni1[0].x;
            commonIntersect = true;
        }
        else if(ni1[0].x < ni2[0].x)
        {
            currentMedianLine1G1 = ni1[1];
            xOfLastIntersect = ni1[0].x;
            intersects.push(ni1);
        }
        else if(ni2[0].x < ni1[0].x)
        {
            currentMedianLine2G1 = ni2[1];
            xOfLastIntersect = ni2[0].x;
            intersects.push(ni2);
        }

        if(commonIntersect)
        {
            if(intersects.length != 4)
            {
                // Next to nicely enclosed polygons, median-areas to the
                // left and right of the problem also exist. But we ignore
                // them for now.
                intersects = [intersects[intersects.length - 1]];
            }
            else
            {                
                // Swap the last two elements of the array to order the points
                // to form a polygon.
                swap = intersects[intersects.length - 1];
                intersects[intersects.length - 1] = intersects[intersects.length - 2];
                intersects[intersects.length - 2] = swap;
                medianPolygons.push(intersects);

                // add the last intersect also to the next polygon
                intersects = [swap];
            }
        }
    }
    return medianPolygons; 
}

function FindSliceEven(dualGroupOne, dualGroupTwo, intersectionGroupOne, intersectionGroupTwo, xOfLastIntersect)
{
    g1poly = FindMedianPolygons(dualGroupOne, intersectionGroupOne, xOfLastIntersect);
    g2poly = FindMedianPolygons(dualGroupTwo, intersectionGroupTwo, xOfLastIntersect);
    for(var i = 0; i<g1poly.length; i++)
    {
        for(var j = 0; j<g2poly.length; j++)
        {
            if(PolygonsOverlap(g1poly[i], g2poly[j]))
            {
                console.log('found a poly')
            }
        }
    }
    return new Point(0,0);
}

function PolygonsOverlap(poly1, poly2)
{
    // based on http://stackoverflow.com/questions/753140/how-do-i-determine-if-two-convex-polygons-intersect
    return !(PolygonOverlapCheck(poly1, poly2) && PolygonOverlapCheck(poly2, poly1));
}

function PolygonOverlapCheck(poly1, poly2)
{
    for(var i = 0; i < poly1.length; i++)
    {
        i2 = (i < poly1.length - 1) ? i + 1 : 0;
        candidateLine = new Line(poly[i], poly[i2]);
        isSplitLine = true;

        sideOfP2 = candidateLine.orientation(poly[0]);

        for(var j = 1; j < poly2.length; j++)
        {
            if(candidateLine.orientation(poly[j]) != sideOfP2)
            {
                isSplitLine = false;
                break;
            }
        }

        if(isSplitLine)
        {
            return false;
        }
    }
    return true;
}

function FindMedianIntersections(dualGroupOne, dualGroupTwo, indexOfMedianLine1, indexOfMedianLine2, intersectionGroupOne, intersectionGroupTwo, xOfLastIntersect)
{
    intersections = []
    while(true)
    {
        currentMedianLine1 = dualGroupOne[indexOfMedianLine1];
        currentMedianLine2 = dualGroupTwo[indexOfMedianLine2];
        nextIntersect1 = intersectionGroupOne[indexOfMedianLine1]
                            .sort(function(a,b){return a[0].x - b[0].x;})
                            .find(function(obj){return obj[0].x > xOfLastIntersect});
        nextIntersect2 = intersectionGroupTwo[indexOfMedianLine2]
                            .sort(function(a,b){return a[0].x - b[0].x;})
                            .find(function(obj){return obj[0].x > xOfLastIntersect});

        if(currentMedianLine1.slope() != currentMedianLine2.slope())
        {
            // If the medians are non-parallel, they will intersect
            // if they intersect before they intersect with another line in their group
            // they are median lines when they intersect, and thus found our point!
            medianIntersect = currentMedianLine1.intersectionWith(currentMedianLine2);
            if(     xOfLastIntersect < medianIntersect.x 
                && (nextIntersect1 == undefined || medianIntersect.x < nextIntersect1[0].x)
                && (nextIntersect2 == undefined || medianIntersect.x < nextIntersect2[0].x))
            {
                intersections.push(medianIntersect);
            }

            // In case both median lines are from the same group,
            // whenever the median lines intersect, it coincides with their own in-group intersection
            // If this is the case, we still have to add it to intersections and advance indices accordingly
            if(xOfLastIntersect < medianIntersect.x
                && nextIntersect1 != undefined
                && nextIntersect2 != undefined
                && nextIntersect1[0].x == nextIntersect2[0].x
                && nextIntersect1[0].y == nextIntersect2[0].y)
            {
                intersections.push(medianIntersect);

                xOfLastIntersect = nextIntersect1[0].x;
                indexOfMedianLine1 = nextIntersect1[1];
                indexOfMedianLine2 = nextIntersect2[1];
            }
        }
        if(nextIntersect1 == undefined  && nextIntersect2 == undefined)
        {
            // Median lines won't change anymore.
            break;
        }
        if((nextIntersect2 == undefined && nextIntersect1 != undefined) 
            || (nextIntersect1 != undefined && nextIntersect1[0].x <= nextIntersect2[0].x))
        {
            // intersect point + slope!=
            xOfLastIntersect = nextIntersect1[0].x;
            indexOfMedianLine1 = nextIntersect1[1];

        }
        if((nextIntersect1 == undefined && nextIntersect2 != undefined)
            || (nextIntersect2 != undefined && nextIntersect1[0].x > nextIntersect2[0].x))
        {
            // intersect point + slope!=
            xOfLastIntersect = nextIntersect2[0].x;
            indexOfMedianLine2 = nextIntersect2[1];
        }
    }
    return intersections;
}


// A cubic time algorithm which simply tries all possible lines,
// and checks whether or not it is a good one.
function NaiveAlgorithm(PointGroupOne, PointGroupTwo, returnMostHorizontal)
{
    returnMostHorizontal = returnMostHorizontal || false;
	// When there is an even number of points, leave out the last point
    var groupOneLength = PointGroupOne.length + (PointGroupOne.length%2 - 1);
	var groupTwoLength = PointGroupTwo.length + (PointGroupTwo.length%2 - 1);
    var candidateList = [];

	for(var i = 0; i < groupOneLength; i++)
	{		
		for(var j = 0; j < groupTwoLength; j++)
		{
			var p1 = PointGroupOne[i].clone();
			var p2 = PointGroupTwo[j].clone();
			var candidateLine = new Line(p1, p2);

			// We allow for a difference of one if the groups are of even size
			// the naive algorithm could be expanded to not need this.
			var allowOneDifference = false;
			var isProperCut = NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne.slice(0,groupOneLength), PointGroupTwo.slice(0,groupTwoLength), allowOneDifference);
			if(isProperCut)
			{
				// If for both group 1 and group 2, there are as many points left as right of the line,
				// it is the line we're looking for - and can stop looking.

                // When there is an even number of points, search the point that is closest to the candidate line (on the side of the left out point)
                var minDistOne = 0;
                var closestPoint = p1;
                var p1median = p1.clone();
                if(PointGroupOne.length%2 == 0)
                {
                    for(var k = 0; k < groupOneLength+1; k++)
                    {
                         var distanceToLine = candidateLine.distance(PointGroupOne[k])*candidateLine.orientation(PointGroupOne[k])*candidateLine.orientation(PointGroupOne[groupOneLength]);
                         if(k != i && (distanceToLine < minDistOne || minDistOne == 0) && distanceToLine > 0) {
                                 minDistOne = distanceToLine;
                                 closestPoint = PointGroupOne[k];
                         }
                    }
                    p1median.x = (closestPoint.x+p1.x)/2;
                    p1median.y = (closestPoint.y+p1.y)/2;
                }
                
                var minDistTwo = 0;
                closestPoint = p2;
                var p2median = p2.clone();
                if(PointGroupTwo.length%2 == 0)
                {
                    for(var l = 0; l < groupTwoLength+1; l++)
                    {
                         var distanceToLine = candidateLine.distance(PointGroupTwo[l])*candidateLine.orientation(PointGroupTwo[l])*candidateLine.orientation(PointGroupTwo[groupTwoLength]);
                         if(l != j && (distanceToLine < minDistTwo || minDistTwo == 0) && distanceToLine > 0) {
                                 minDistTwo = distanceToLine;
                                 var closestPoint = PointGroupTwo[l];
                         }
                    }
                    p2median.x = (closestPoint.x+p2.x)/2;
                    p2median.y = (closestPoint.y+p2.y)/2;
                }

                // First check whether a line through the medians is possible
                candidateLine = new Line(p1median,p2median);
                if(NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne, PointGroupTwo, allowOneDifference))
                {
                    candidateList.push(candidateLine.clone());
                }
                else
                {
                    var minDist = Math.min(minDistOne,minDistTwo);
                    p1median.x = p1.x+(p1median.x-p1.x)*minDist/minDistOne;
                    p1median.y = p1.y+(p1median.y-p1.y)*minDist/minDistOne;
                    p2median.x = p2.x+(p2median.x-p2.x)*minDist/minDistTwo;
                    p2median.y = p2.y+(p2median.y-p2.y)*minDist/minDistTwo;

                    // Otherwise check whether the line can be shifted perpendicular to the median with the smallest distance
                    var oldLine = new Line(p1,p2);
                    candidateLine = new Line(p1median,p2median);
                    if(oldLine.orientation(PointGroupOne[groupOneLength]) == oldLine.orientation(PointGroupTwo[groupTwoLength])
                        && NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne, PointGroupTwo, allowOneDifference))
                    {
                        candidateList.push(candidateLine.clone());
                    }
                    else
                    {
                        candidateList.push(new Line(p1,p2));
                    }
                }
                candidateList.push(new Line(p1,p2));
			}

            if(!returnMostHorizontal && candidateList.length > 0)
                return candidateList[0];
		}
	}

    var mostHorizontalLine = candidateList[0];
    for(var i = 1; i < candidateList.length; i++)
    {
        if(Math.abs(mostHorizontalLine.slope()) > Math.abs(candidateList[i].slope))
        {
            mostHorizontalLine = candidateList[i];
        }
    }
    return mostHorizontalLine;
}

// A function which checks whether or not the given line divides both
// point groups in half, using a linear time algorithm
function NaiveCheckIfLineIsProperCut(line, pointGroupOne, pointGroupTwo, allowOneDifference)
{
	allowOneDifference = allowOneDifference || false;
	var groupOneLength = pointGroupOne.length;
	var groupTwoLength = pointGroupTwo.length;

	// Stores how many points are left/on/right of the line
	var groupOnePositions = [0,0,0];
	var groupTwoPositions = [0,0,0];

	// Given we have a candidate line, we can just count all other points
	// to see whether or not the candidate line is a good split
	// Note that even if we evaluate the points which make up the line,
	// it doesn't matter as they'll be on the line.
	for(var k = 0; k < groupOneLength; k++)
	{
		var p = pointGroupOne[k];
		var pos = line.orientation(p);
		groupOnePositions[pos + 1]++;
	}

	for(var k = 0; k < groupTwoLength; k++)
	{
		var p = pointGroupTwo[k];
		var pos = line.orientation(p);
		groupTwoPositions[pos + 1]++;
	}

	// The groups are split well if both have equally many points on either side
	var groupOneWellSplit = (groupOnePositions[0] == groupOnePositions[2]);
	var groupTwoWellSplit = (groupTwoPositions[0] == groupTwoPositions[2]);

	// However, if a group is of even size, then there won't be a split with as many points
	// to the left as to the right, so we allow for a difference of one (if we evaluate a slice through two points)
	if(allowOneDifference)
	{
		if(groupOneLength % 2 == 0)
		{
			groupOneWellSplit = ((groupOnePositions[0] + 1 == groupOnePositions[2]) || (groupOnePositions[0] - 1 == groupOnePositions[2]));
		}
		if(groupTwoLength % 2 == 0)
		{
			groupTwoWellSplit = ((groupTwoPositions[0] + 1 == groupTwoPositions[2]) || (groupTwoPositions[0] - 1 == groupTwoPositions[2]));
		}
	}


	// If for both group 1 and group 2, there are as many points left as right of the line, it is a proper cut
	return groupOneWellSplit && groupTwoWellSplit;
}